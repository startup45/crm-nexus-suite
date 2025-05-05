import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ChatMessage, ChatGroup, ChatContact, ChatGroupMember } from '@/types/chat';

export function useChat() {
  const { currentUser, userProfile } = useAuth();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isGroup, setIsGroup] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Fetch contacts (other users)
  const fetchContacts = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // Get all users except current user
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', currentUser.id);
      
      if (error) {
        throw error;
      }

      // Format contacts and get last messages
      const contactsWithMeta = await Promise.all(
        data.map(async (contact) => {
          // Get last message between current user and contact
          const { data: messageData, error: messageError } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${contact.user_id}),and(sender_id.eq.${contact.user_id},receiver_id.eq.${currentUser.id})`)
            .order('created_at', { ascending: false })
            .limit(1);

          if (messageError) {
            console.error('Error fetching last message:', messageError);
          }

          // Get unread count
          const { count: unreadCount, error: unreadError } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('sender_id', contact.user_id)
            .eq('receiver_id', currentUser.id)
            .eq('read', false);

          if (unreadError) {
            console.error('Error fetching unread count:', unreadError);
          }

          // Check if user is online (this would ideally connect to a presence system)
          const isOnline = false; // Will be replaced with actual presence check

          const lastMessage = messageData && messageData.length > 0 ? messageData[0] : null;

          return {
            ...contact,
            last_message: lastMessage?.content || '',
            last_message_time: lastMessage?.created_at ? new Date(lastMessage.created_at).toLocaleString() : '',
            unread_count: unreadCount || 0,
            is_online: isOnline
          } as ChatContact;
        })
      );

      setContacts(contactsWithMeta);
      
      // Update unread counts
      const countMap: Record<string, number> = {};
      contactsWithMeta.forEach(contact => {
        countMap[contact.user_id] = contact.unread_count;
      });
      setUnreadCounts(prev => ({ ...prev, ...countMap }));
      
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    }
  }, [currentUser]);

  // Fetch user groups
  const fetchGroups = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // Get groups the user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', currentUser.id);
      
      if (memberError) {
        throw memberError;
      }
      
      if (!memberData.length) {
        setGroups([]);
        return;
      }
      
      const groupIds = memberData.map(member => member.group_id);
      
      // Get group details
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .in('id', groupIds);
      
      if (groupsError) {
        throw groupsError;
      }

      // Format groups with last message
      const groupsWithMeta = await Promise.all(
        groupsData.map(async (group) => {
          // Get last message in group
          const { data: lastMessageData, error: lastMessageError } = await supabase
            .from('messages')
            .select('*')
            .eq('group_id', group.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (lastMessageError) {
            console.error(`Error fetching last message for group ${group.id}:`, lastMessageError);
          }

          // Get unread count for this group
          const { count: unreadCount, error: unreadError } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('group_id', group.id)
            .neq('sender_id', currentUser.id)
            .eq('read', false);

          if (unreadError) {
            console.error(`Error fetching unread count for group ${group.id}:`, unreadError);
          }

          const lastMessage = lastMessageData && lastMessageData.length > 0 ? lastMessageData[0] : null;

          // Update unread counts state
          setUnreadCounts(prev => ({
            ...prev,
            [`group-${group.id}`]: unreadCount || 0
          }));

          return {
            ...group,
            last_message: lastMessage?.content || '',
            last_message_time: lastMessage?.created_at ? new Date(lastMessage.created_at).toLocaleString() : '',
            unread_count: unreadCount || 0
          };
        })
      );

      setGroups(groupsWithMeta);
      
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    }
  }, [currentUser]);

  // Fetch messages for a conversation (direct or group)
  const fetchMessages = useCallback(async (targetId: string, isGroupChat: boolean) => {
    if (!currentUser) return;
    
    try {
      let query;
      
      if (isGroupChat) {
        // Fetch group messages
        query = supabase
          .from('messages')
          .select('*')
          .eq('group_id', targetId)
          .order('created_at', { ascending: true });
      } else {
        // Fetch direct messages
        query = supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${targetId}),and(sender_id.eq.${targetId},receiver_id.eq.${currentUser.id})`)
          .order('created_at', { ascending: true });
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setMessages(data);
      
      // Mark messages as read
      if (data && data.length > 0) {
        const unreadMessages = data.filter(msg => 
          !msg.read && msg.sender_id !== currentUser.id
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
            
          // Update unread counts
          const targetKey = isGroupChat ? `group-${targetId}` : targetId;
          setUnreadCounts(prev => ({
            ...prev,
            [targetKey]: 0
          }));
        }
      }
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  }, [currentUser]);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!currentUser || !selectedConversationId || !content.trim()) {
      return;
    }
    
    try {
      const messageData: Partial<ChatMessage> = {
        content,
        sender_id: currentUser.id,
        created_at: new Date().toISOString(),
        read: false
      };
      
      if (isGroup) {
        messageData.group_id = selectedConversationId;
      } else {
        messageData.receiver_id = selectedConversationId;
      }
      
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update local messages
      setMessages(prev => [...prev, data as ChatMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  }, [currentUser, selectedConversationId, isGroup]);

  // Create a new group
  const createGroup = useCallback(async (name: string, description: string, memberIds: string[]) => {
    if (!currentUser) {
      toast.error('You must be logged in to create a group');
      return null;
    }
    
    try {
      // Create group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name,
          description,
          created_by: currentUser.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (groupError) {
        throw groupError;
      }
      
      // Add creator as admin
      const { error: creatorError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: currentUser.id,
          role: 'admin',
          joined_at: new Date().toISOString()
        });
      
      if (creatorError) {
        throw creatorError;
      }
      
      // Add other members
      if (memberIds.length > 0) {
        const memberRows = memberIds.map(userId => ({
          group_id: groupData.id,
          user_id: userId,
          role: 'member',
          joined_at: new Date().toISOString()
        }));
        
        const { error: membersError } = await supabase
          .from('group_members')
          .insert(memberRows);
        
        if (membersError) {
          console.error('Error adding members:', membersError);
        }
      }
      
      // Refresh groups list
      await fetchGroups();
      toast.success(`Group "${name}" created successfully`);
      return groupData;
      
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
      return null;
    }
  }, [currentUser, fetchGroups]);

  // Get group members
  const getGroupMembers = useCallback(async (groupId: string) => {
    try {
      // Get member user IDs
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId);
      
      if (memberError) {
        throw memberError;
      }
      
      if (!memberData.length) {
        return [];
      }
      
      // Get user profiles for members
      const memberIds = memberData.map(m => m.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', memberIds);
      
      if (profilesError) {
        throw profilesError;
      }
      
      // Combine profiles with member roles
      const members = profilesData.map(profile => {
        const memberInfo = memberData.find(m => m.user_id === profile.user_id);
        return {
          ...profile,
          group_role: memberInfo?.role || 'member',
          joined_at: memberInfo?.joined_at
        };
      });
      
      return members;
      
    } catch (error) {
      console.error('Error fetching group members:', error);
      toast.error('Failed to load group members');
      return [];
    }
  }, []);

  // Add member to group
  const addGroupMember = useCallback(async (groupId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: userId,
          role: 'member',
          joined_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('Member added to group');
      return true;
      
    } catch (error) {
      console.error('Error adding group member:', error);
      toast.error('Failed to add member to group');
      return false;
    }
  }, []);

  // Remove member from group
  const removeGroupMember = useCallback(async (groupId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Member removed from group');
      return true;
      
    } catch (error) {
      console.error('Error removing group member:', error);
      toast.error('Failed to remove member from group');
      return false;
    }
  }, []);

  // Set up real-time updates
  useEffect(() => {
    if (!currentUser) return;
    
    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new as ChatMessage;
        
        // Update messages if in the current conversation
        if (
          (isGroup && newMessage.group_id === selectedConversationId) ||
          (!isGroup && 
            ((newMessage.sender_id === currentUser.id && newMessage.receiver_id === selectedConversationId) || 
             (newMessage.sender_id === selectedConversationId && newMessage.receiver_id === currentUser.id))
          )
        ) {
          setMessages(prev => [...prev, newMessage]);
          
          // Mark message as read if it's for the current user
          if (newMessage.sender_id !== currentUser.id) {
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMessage.id)
              .then();
          }
        }
        
        // Update unread counts
        if (newMessage.receiver_id === currentUser.id) {
          setUnreadCounts(prev => ({
            ...prev,
            [newMessage.sender_id]: (prev[newMessage.sender_id] || 0) + 1
          }));
          // Refresh contacts to update last messages
          fetchContacts();
        } else if (newMessage.group_id && newMessage.sender_id !== currentUser.id) {
          setUnreadCounts(prev => ({
            ...prev,
            [`group-${newMessage.group_id}`]: (prev[`group-${newMessage.group_id}`] || 0) + 1
          }));
          // Refresh groups to update last messages
          fetchGroups();
        }
      })
      .subscribe();
      
    return () => {
      messageSubscription.unsubscribe();
    };
  }, [currentUser, selectedConversationId, isGroup, fetchContacts, fetchGroups]);

  // Load initial data
  useEffect(() => {
    if (currentUser) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([
          fetchContacts(),
          fetchGroups()
        ]);
        setLoading(false);
      };
      
      loadData();
    }
  }, [currentUser, fetchContacts, fetchGroups]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId, isGroup);
    } else {
      setMessages([]);
    }
  }, [selectedConversationId, isGroup, fetchMessages]);

  return {
    contacts,
    groups,
    messages,
    loading,
    selectedConversationId,
    isGroup,
    unreadCounts,
    setSelectedConversationId,
    setIsGroup,
    sendMessage,
    createGroup,
    getGroupMembers,
    addGroupMember,
    removeGroupMember,
    fetchContacts,
    fetchGroups
  };
}

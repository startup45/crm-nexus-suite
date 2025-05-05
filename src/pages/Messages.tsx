import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, SendHorizontal, UserPlus, Users, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/components/layout/MainLayout';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ChatContact, ChatGroup } from '@/types/chat';

const Messages = () => {
  const { 
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
    fetchContacts
  } = useChat();
  
  const { currentUser, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>('direct');
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Record<string, boolean>>({});
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Filter contacts/groups based on search
  const filteredContacts = searchQuery
    ? contacts.filter(contact =>
        contact.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  const filteredGroups = searchQuery
    ? groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : groups;

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load group members when viewing group info
  useEffect(() => {
    const loadGroupMembers = async () => {
      if (isGroup && selectedConversationId && isGroupInfoOpen) {
        const members = await getGroupMembers(selectedConversationId);
        setGroupMembers(members);
      }
    };
    
    loadGroupMembers();
  }, [isGroup, selectedConversationId, isGroupInfoOpen, getGroupMembers]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversationId) return;
    
    await sendMessage(messageInput);
    setMessageInput('');
  };

  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle creating a new group
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    
    const selectedMemberIds = Object.entries(selectedMembers)
      .filter(([_, isSelected]) => isSelected)
      .map(([userId]) => userId);
    
    if (selectedMemberIds.length === 0) {
      toast.error('Please select at least one group member');
      return;
    }
    
    const newGroup = await createGroup(groupName, groupDescription, selectedMemberIds);
    
    if (newGroup) {
      setIsCreateGroupOpen(false);
      setGroupName('');
      setGroupDescription('');
      setSelectedMembers({});
      
      // Switch to groups tab and select the new group
      setActiveTab('groups');
      setSelectedConversationId(newGroup.id);
      setIsGroup(true);
    }
  };

  // Handle selecting a conversation
  const handleSelectConversation = (id: string, isGroupChat: boolean) => {
    setSelectedConversationId(id);
    setIsGroup(isGroupChat);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Find current conversation details
  const getCurrentConversation = () => {
    if (isGroup) {
      return groups.find(g => g.id === selectedConversationId);
    } else {
      return contacts.find(c => c.user_id === selectedConversationId);
    }
  };
  
  const currentConversation = getCurrentConversation();

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 h-[calc(100vh-240px)]">
          {/* Contacts/Groups List */}
          <Card className="h-full overflow-hidden flex flex-col">
            <CardHeader className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <Tabs 
                  defaultValue="direct" 
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as 'direct' | 'groups')}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="direct" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Direct
                    </TabsTrigger>
                    <TabsTrigger value="groups" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Groups
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 overflow-y-auto flex-1">
              <TabsContent value="direct" className="m-0">
                <div className="flex flex-col">
                  {loading ? (
                    <div className="flex items-center justify-center h-20">
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.user_id}
                        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedConversationId === contact.user_id && !isGroup ? 'bg-muted' : ''
                        }`}
                        onClick={() => handleSelectConversation(contact.user_id, false)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={contact.avatar_url || ''} />
                            <AvatarFallback>{getInitials(contact.full_name)}</AvatarFallback>
                          </Avatar>
                          {contact.is_online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">{contact.full_name}</h3>
                            <span className="text-xs text-muted-foreground">
                              {contact.last_message_time || ''}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {contact.last_message || ''}
                          </p>
                        </div>
                        {unreadCounts[contact.user_id] > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary">
                            {unreadCounts[contact.user_id]}
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      {searchQuery ? 'No contacts found.' : 'No contacts available.'}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Groups List Tab Content */}
              <TabsContent value="groups" className="m-0">
                <div className="flex flex-col">
                  <div 
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border"
                    onClick={() => setIsCreateGroupOpen(true)}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="font-medium">Create New Group</div>
                  </div>
                  
                  {loading ? (
                    <div className="flex items-center justify-center h-20">
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedConversationId === group.id && isGroup ? 'bg-muted' : ''
                        }`}
                        onClick={() => handleSelectConversation(group.id, true)}
                      >
                        <Avatar>
                          <AvatarImage src={group.avatar_url || ''} />
                          <AvatarFallback>{getInitials(group.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">{group.name}</h3>
                            <span className="text-xs text-muted-foreground">
                              {group.last_message_time || ''}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {group.last_message || ''}
                          </p>
                        </div>
                        {unreadCounts[`group-${group.id}`] > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary">
                            {unreadCounts[`group-${group.id}`]}
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      {searchQuery ? 'No groups found.' : 'No groups available.'}
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Card>

          {/* Messages Chat */}
          <Card className="h-full overflow-hidden flex flex-col">
            {selectedConversationId ? (
              <>
                <CardHeader className="border-b p-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={currentConversation?.avatar_url || ''} />
                      <AvatarFallback>
                        {currentConversation ? getInitials(isGroup ? 
                          (currentConversation as ChatGroup).name : 
                          (currentConversation as ChatContact).full_name) : ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <CardTitle className="text-base">
                        {isGroup 
                          ? (currentConversation as ChatGroup)?.name
                          : (currentConversation as ChatContact)?.full_name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {isGroup 
                          ? (currentConversation as ChatGroup)?.description || 'Group chat'
                          : (currentConversation as ChatContact)?.is_online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  
                  {isGroup && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsGroupInfoOpen(true)}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Members
                    </Button>
                  )}
                </CardHeader>
                
                <CardContent 
                  ref={messageListRef} 
                  className="p-0 flex-1 overflow-y-auto flex flex-col"
                >
                  <ScrollArea className="h-full p-4 space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center h-20">
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : messages.length > 0 ? (
                      <div className="flex flex-col space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender_id === currentUser?.id ? "justify-end" : "justify-start"
                            }`}
                          >
                            {message.sender_id !== currentUser?.id && (
                              <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                                <AvatarFallback>
                                  {isGroup ? getInitials(
                                    contacts.find(c => c.user_id === message.sender_id)?.full_name || 'User'
                                  ) : getInitials((currentConversation as ChatContact)?.full_name || 'User')}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender_id === currentUser?.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {isGroup && message.sender_id !== currentUser?.id && (
                                <p className="text-xs font-medium mb-1">
                                  {contacts.find(c => c.user_id === message.sender_id)?.full_name || 'User'}
                                </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender_id === currentUser?.id
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}>
                                {new Date(message.created_at).toLocaleTimeString([], {
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <p>{isGroup ? 'Start the group conversation!' : 'Say hello!'}</p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                
                <CardFooter className="border-t p-4">
                  <div className="flex w-full gap-2">
                    <Textarea
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 min-h-10 max-h-32"
                      rows={1}
                    />
                    <Button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || !selectedConversationId}
                      className="self-end"
                    >
                      <SendHorizontal className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Create Group Dialog */}
      <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new group and add members to start a group conversation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="groupDescription">Description (optional)</Label>
              <Textarea
                id="groupDescription"
                placeholder="Enter group description"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Select Members</Label>
              <ScrollArea className="h-60 border rounded-md p-2">
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div key={contact.user_id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`member-${contact.user_id}`}
                        checked={selectedMembers[contact.user_id] || false}
                        onCheckedChange={(checked) => {
                          setSelectedMembers(prev => ({
                            ...prev,
                            [contact.user_id]: Boolean(checked)
                          }));
                        }}
                      />
                      <Label
                        htmlFor={`member-${contact.user_id}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{getInitials(contact.full_name)}</AvatarFallback>
                        </Avatar>
                        <span>{contact.full_name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Group Info Dialog */}
      <Dialog open={isGroupInfoOpen} onOpenChange={setIsGroupInfoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
            <DialogDescription>
              {currentConversation && isGroup ? 
                (currentConversation as ChatGroup).description : 'Members in this group'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <ScrollArea className="h-60">
              <div className="space-y-2">
                {groupMembers.map((member) => (
                  <div key={member.user_id} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar_url || ''} />
                        <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.group_role === 'admin' ? 'Admin' : 'Member'} • {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsGroupInfoOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </MainLayout>
  );
};

export default Messages;

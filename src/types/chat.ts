
export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id?: string; // For direct messages
  group_id?: string; // For group messages
  content: string;
  created_at: string;
  read: boolean;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

export interface ChatGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: 'admin' | 'manager' | 'employee' | 'intern' | 'client';
  avatar_url?: string;
  created_at: string;
}

export type ChatContact = UserProfile & {
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  is_online: boolean;
};

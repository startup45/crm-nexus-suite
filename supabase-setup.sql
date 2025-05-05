
-- Create profiles table for extended user data
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'employee', 'intern', 'client')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create profile policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create messages table for both direct and group messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  receiver_id UUID REFERENCES auth.users(id),
  group_id UUID,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT false,
  -- Either receiver_id or group_id must be set, but not both
  CONSTRAINT either_receiver_or_group CHECK (
    (receiver_id IS NULL AND group_id IS NOT NULL) OR
    (receiver_id IS NOT NULL AND group_id IS NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create messages policies
CREATE POLICY "Users can view messages they've sent or received"
ON messages FOR SELECT USING (
  auth.uid() = sender_id OR 
  auth.uid() = receiver_id OR
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = messages.group_id 
    AND group_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own messages"
ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages (mark as read)"
ON messages FOR UPDATE USING (
  auth.uid() = sender_id OR
  auth.uid() = receiver_id OR
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = messages.group_id 
    AND group_members.user_id = auth.uid()
  )
);

-- Create groups table
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  avatar_url TEXT
);

-- Enable Row Level Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Create group policies
CREATE POLICY "Users can view groups they are members of"
ON groups FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = id 
    AND group_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create groups"
ON groups FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update group details"
ON groups FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = id 
    AND group_members.user_id = auth.uid() 
    AND group_members.role = 'admin'
  )
);

-- Create group_members table
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Create group_members policies
CREATE POLICY "Users can view members in their groups"
ON group_members FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM group_members AS gm
    WHERE gm.group_id = group_id 
    AND gm.user_id = auth.uid()
  )
);

CREATE POLICY "Group admins can add members"
ON group_members FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = group_id 
    AND group_members.user_id = auth.uid() 
    AND group_members.role = 'admin'
  ) OR (
    -- Allow users to add themselves when creating a new group
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_id
      AND groups.created_by = auth.uid()
    )
  )
);

CREATE POLICY "Group admins can update member roles"
ON group_members FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = group_id 
    AND group_members.user_id = auth.uid() 
    AND group_members.role = 'admin'
  )
);

CREATE POLICY "Group admins can remove members or users can leave groups"
ON group_members FOR DELETE USING (
  (
    EXISTS (
      SELECT 1 FROM group_members AS gm
      WHERE gm.group_id = group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role = 'admin'
    )
  ) OR user_id = auth.uid()
);

-- Create functions for realtime features
CREATE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to notify on new messages
CREATE FUNCTION notify_new_message() 
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'new_message',
    json_build_object(
      'id', NEW.id,
      'sender_id', NEW.sender_id,
      'receiver_id', NEW.receiver_id,
      'group_id', NEW.group_id,
      'content', NEW.content,
      'created_at', NEW.created_at
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_message();

-- Create demo users and data
-- Note: In a real Supabase project, you would use the Supabase Auth UI or API to create these users
-- These SQL statements are just for understanding the structure

-- Create demo data for profiles
INSERT INTO public.profiles (user_id, full_name, role)
VALUES 
  ('admin-user-id', 'System Administrator', 'admin'),
  ('manager-user-id', 'John Manager', 'manager'),
  ('employee-user-id', 'Jane Employee', 'employee'),
  ('intern-user-id', 'Sam Intern', 'intern'),
  ('client-user-id', 'Anna Client', 'client');

-- Create a demo group
INSERT INTO public.groups (id, name, description, created_by, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Project Team', 'Team discussion for the CRM project', 'manager-user-id', now());

-- Add members to the demo group
INSERT INTO public.group_members (group_id, user_id, role, joined_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'manager-user-id', 'admin', now()),
  ('11111111-1111-1111-1111-111111111111', 'employee-user-id', 'member', now()),
  ('11111111-1111-1111-1111-111111111111', 'intern-user-id', 'member', now());

-- Add some demo messages
INSERT INTO public.messages (sender_id, receiver_id, content, created_at, read)
VALUES 
  ('manager-user-id', 'employee-user-id', 'Hi Jane, how is the project coming along?', now() - interval '2 days', true),
  ('employee-user-id', 'manager-user-id', 'Going well! I should have the first milestone ready tomorrow.', now() - interval '2 days', true),
  ('manager-user-id', 'intern-user-id', 'Sam, could you help Jane with the project research?', now() - interval '1 day', true),
  ('intern-user-id', 'manager-user-id', 'Sure thing! I\'ll coordinate with her today.', now() - interval '1 day', false),
  ('client-user-id', 'manager-user-id', 'When can we expect the first demo?', now() - interval '12 hours', false);

-- Add some demo group messages
INSERT INTO public.messages (sender_id, group_id, content, created_at, read)
VALUES 
  ('manager-user-id', '11111111-1111-1111-1111-111111111111', 'Welcome to the project team channel!', now() - interval '3 days', true),
  ('employee-user-id', '11111111-1111-1111-1111-111111111111', 'Thanks! Excited to collaborate here.', now() - interval '3 days', true),
  ('intern-user-id', '11111111-1111-1111-1111-111111111111', 'Hello everyone! Looking forward to working with you all.', now() - interval '2 days', true),
  ('manager-user-id', '11111111-1111-1111-1111-111111111111', 'Our first milestone is due next Friday. Let\'s coordinate tasks.', now() - interval '1 day', false);

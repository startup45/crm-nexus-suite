
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use the project ID from the Supabase config
const projectId = 'ddsyiiftopkjshenqpfk';

// Set Supabase URL and key directly from the project info
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkc3lpaWZ0b3BranNoZW5xcGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTc4NjcsImV4cCI6MjA2MjAzMzg2N30.BYeeBAVtSbbILsn4rcmhvgqrdwnB5aH1rNv8MAe0nnc';

// Create a real Supabase client with direct values instead of relying on env variables
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get user ID from session
export const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id;
};


import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log error if environment variables are not set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// Create a mock Supabase client if variables are missing to prevent app from crashing
// This allows the app to load, but Supabase functionality won't work
const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback) => {
        // Return a mock subscription object
        return {
          data: { 
            subscription: { 
              unsubscribe: () => {} 
            } 
          }
        };
      }
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          order: () => ({
            limit: () => ({ data: [], error: null }),
          }),
          // Removed duplicate eq property
        }),
        eq: () => ({ data: [], error: null }),
        neq: () => ({ data: [], error: null }),
        order: () => ({
          limit: () => ({ data: [], error: null }),
        }),
        match: () => ({ data: [], error: null }),
      }),
      insert: () => ({ error: { message: 'Supabase not configured' }, data: null }),
      update: () => ({
        eq: () => ({ error: null }),
      }),
      delete: () => ({
        eq: () => ({ error: null }),
      }),
    }),
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
    }),
  };
};

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any;

// Helper function to get user ID from session
export const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id;
};

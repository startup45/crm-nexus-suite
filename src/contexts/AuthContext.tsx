
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface AuthContextProps {
  currentUser: User | null;
  userRole: string | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
  isIntern: boolean;
  isClient: boolean;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (module: string, action: 'create' | 'read' | 'update' | 'delete') => boolean;
}

// Define user profile interface for extended user data
interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: 'admin' | 'manager' | 'employee' | 'intern' | 'client';
  avatar_url?: string;
  created_at: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch user profile data when auth state changes
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };
  
  // Check for existing session on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setCurrentUser(session.user);
          
          // Fetch user profile data
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    try {
      // Set up auth state change listener with error handling
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setCurrentUser(session.user);
            
            // Fetch updated profile data
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              setUserProfile(profile);
            }
          } else {
            setCurrentUser(null);
            setUserProfile(null);
          }
          
          setLoading(false);
        }
      );
      
      return () => {
        if (data && data.subscription) {
          data.subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error("Error setting up auth state change listener:", error);
      setLoading(false);
      return () => {};
    }
  }, []);
  
  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      if (data.user) {
        toast.success('Login successful!');
        
        // Fetch profile after successful login
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUserProfile(profile);
        }
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };
  
  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };
  
  // Helper values
  const userRole = userProfile?.role || null;
  
  // Helper functions to check roles
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const isEmployee = userRole === 'employee';
  const isIntern = userRole === 'intern';
  const isClient = userRole === 'client';

  // Role-based permission checks
  const hasPermission = (module: string, action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!userRole) return false;
    
    // Define permission matrix based on roles and module/action
    const permissions: Record<string, Record<string, string[]>> = {
      'admin': {
        'create': ['all'],
        'read': ['all'],
        'update': ['all'],
        'delete': ['all']
      },
      'manager': {
        'create': ['clients', 'tasks', 'projects', 'leads', 'messages', 'groups'],
        'read': ['all'],
        'update': ['clients', 'tasks', 'projects', 'leads', 'messages', 'groups'],
        'delete': ['tasks', 'projects', 'leads', 'messages', 'groups']
      },
      'employee': {
        'create': ['tasks', 'messages', 'groups'],
        'read': ['clients', 'tasks', 'projects', 'leads', 'messages', 'groups'],
        'update': ['tasks'],
        'delete': ['messages']
      },
      'intern': {
        'create': ['messages'],
        'read': ['tasks', 'projects', 'messages', 'groups'],
        'update': [],
        'delete': []
      },
      'client': {
        'create': ['messages'],
        'read': ['messages', 'groups'],
        'update': [],
        'delete': []
      }
    };
    
    // Check if user has permission
    const rolePermissions = permissions[userRole];
    if (!rolePermissions) return false;
    
    const actionPermissions = rolePermissions[action];
    if (!actionPermissions) return false;
    
    return actionPermissions.includes('all') || actionPermissions.includes(module);
  };

  const value = {
    currentUser,
    userRole,
    loading,
    isAdmin,
    isManager,
    isEmployee,
    isIntern,
    isClient,
    userProfile,
    signIn,
    signOut,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

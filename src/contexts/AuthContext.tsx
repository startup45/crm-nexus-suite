
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, getCurrentUser, getUserRole } from '@/lib/firebase';

interface AuthContextProps {
  currentUser: User | null;
  userRole: string | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
  isIntern: boolean;
  isClient: boolean;
  hasPermission: (module: string, action: 'create' | 'read' | 'update' | 'delete') => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Simple permission matrix - in a real app, this would come from Firestore
  const permissionMatrix: Record<string, Record<string, string[]>> = {
    admin: {
      create: ['*'],
      read: ['*'],
      update: ['*'],
      delete: ['*']
    },
    manager: {
      create: ['clients', 'leads', 'projects', 'tasks', 'interns', 'documents', 'messages', 'tickets', 'calendarEvents'],
      read: ['*'],
      update: ['clients', 'leads', 'projects', 'tasks', 'interns', 'attendance', 'documents', 'messages', 'tickets', 'calendarEvents'],
      delete: ['tasks', 'documents', 'messages', 'tickets', 'calendarEvents']
    },
    employee: {
      create: ['tasks', 'documents', 'messages', 'tickets', 'calendarEvents'],
      read: ['clients', 'leads', 'projects', 'tasks', 'interns', 'documents', 'messages', 'tickets', 'calendarEvents'],
      update: ['tasks', 'documents', 'messages', 'tickets', 'calendarEvents'],
      delete: ['tasks', 'documents', 'messages']
    },
    intern: {
      create: ['tasks', 'documents', 'messages'],
      read: ['tasks', 'documents', 'messages', 'calendarEvents'],
      update: ['tasks', 'documents', 'messages'],
      delete: []
    },
    client: {
      create: ['tickets', 'messages'],
      read: ['projects', 'tasks', 'documents', 'tickets', 'messages', 'calendarEvents'],
      update: [],
      delete: []
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Helper functions to check roles
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const isEmployee = userRole === 'employee';
  const isIntern = userRole === 'intern';
  const isClient = userRole === 'client';

  // Function to check if user has permission for a specific action on a module
  const hasPermission = (module: string, action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!userRole || !currentUser) return false;
    
    const userPermissions = permissionMatrix[userRole]?.[action] || [];
    return userPermissions.includes('*') || userPermissions.includes(module);
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

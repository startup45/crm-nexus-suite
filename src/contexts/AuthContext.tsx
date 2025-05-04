import React, { createContext, useContext } from 'react';
import { useStore } from '@/lib/store';
import type { User } from '@/lib/store';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useStore();
  
  // In this version without RBAC, all users have all permissions
  // But we keep the structure to maintain UI compatibility
  const userRole = currentUser?.role || null;
  const loading = false;
  
  // Helper functions to check roles
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const isEmployee = userRole === 'employee';
  const isIntern = userRole === 'intern';
  const isClient = userRole === 'client';

  // In this version, everybody has permissions for everything
  const hasPermission = () => true;

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

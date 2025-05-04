
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
  requiredPermission?: {
    module: string;
    action: 'create' | 'read' | 'update' | 'delete';
  };
}

const MainLayout = ({ children, requiredPermission }: MainLayoutProps) => {
  const { currentUser, loading, hasPermission } = useAuth();

  // Handle loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check permission if required
  if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.action)) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-background/95 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

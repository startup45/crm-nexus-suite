
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Users, UserPlus, Briefcase, CheckSquare, 
  UserMinus, ClipboardList, Calendar, FileText, BarChart4, 
  MessageSquare, LifeBuoy, Ticket, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  
  const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Leads', path: '/leads', icon: UserPlus },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Interns', path: '/interns', icon: UserMinus },
    { name: 'Attendance', path: '/attendance', icon: ClipboardList },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Finance', path: '/finance', icon: BarChart4 },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Support', path: '/support', icon: LifeBuoy },
    { name: 'Ticketing', path: '/ticketing', icon: Ticket },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 left-0 z-30 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[250px]'
      )}
    >
      <div className={cn(
        'flex items-center h-16 px-3 border-b border-sidebar-border',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="font-semibold text-lg flex items-center">
            <span className="text-primary">CRM</span>
            <span className="ml-1">Nexus</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="h-7 w-7"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'sidebar-item',
                isActive && 'sidebar-item-active',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/60">
            CRM Nexus Suite v1.0
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

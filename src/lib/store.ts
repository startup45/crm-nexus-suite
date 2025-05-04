import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Types
export type User = {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'employee' | 'intern' | 'client';
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  createdBy: string;
  dueDate: string;
  project: string;
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  clientId: string;
  startDate: string;
  endDate: string;
  budget: number;
  createdAt: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  source: string;
  createdAt: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
};

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  userId: string;
  createdAt: string;
};

export type Document = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdBy: string;
  createdAt: string;
};

export type Intern = {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'terminated';
  createdAt: string;
};

export type Attendance = {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'half_day';
};

// Mock data generator functions
const generateMockUsers = (): User[] => [
  { id: '1', email: 'admin@crmnexus.com', fullName: 'System Administrator', role: 'admin' },
  { id: '2', email: 'manager@crmnexus.com', fullName: 'John Manager', role: 'manager' },
  { id: '3', email: 'employee@crmnexus.com', fullName: 'Jane Employee', role: 'employee' },
  { id: '4', email: 'intern@crmnexus.com', fullName: 'Sam Intern', role: 'intern' },
  { id: '5', email: 'client@crmnexus.com', fullName: 'Anna Client', role: 'client' },
];

const generateMockClients = (): Client[] => [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '555-123-4567',
    company: 'Acme Corp',
    status: 'active',
    createdAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: '2',
    name: 'Globex Industries',
    email: 'info@globex.com',
    phone: '555-987-6543',
    company: 'Globex',
    status: 'active',
    createdAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: '3',
    name: 'Wayne Enterprises',
    email: 'business@wayne.com',
    phone: '555-246-8024',
    company: 'Wayne Enterprises',
    status: 'inactive',
    createdAt: new Date(2023, 3, 5).toISOString(),
  },
];

const generateMockTasks = (): Task[] => [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft and finalize the proposal for the new client',
    status: 'in_progress',
    priority: 'high',
    assignedTo: '3',
    createdBy: '2',
    dueDate: new Date(2023, 5, 15).toISOString(),
    project: '1',
    createdAt: new Date(2023, 5, 1).toISOString(),
  },
  {
    id: '2',
    title: 'Client meeting preparation',
    description: 'Prepare presentation and demo for client meeting',
    status: 'todo',
    priority: 'medium',
    assignedTo: '2',
    createdBy: '1',
    dueDate: new Date(2023, 5, 20).toISOString(),
    project: '1',
    createdAt: new Date(2023, 5, 2).toISOString(),
  },
  {
    id: '3',
    title: 'Website redesign',
    description: 'Update the company website with new branding',
    status: 'completed',
    priority: 'low',
    assignedTo: '3',
    createdBy: '2',
    dueDate: new Date(2023, 4, 30).toISOString(),
    project: '2',
    createdAt: new Date(2023, 4, 15).toISOString(),
  },
];

const generateMockProjects = (): Project[] => [
  {
    id: '1',
    name: 'CRM Implementation',
    description: 'Implementing a new CRM system for Acme Corp',
    status: 'active',
    clientId: '1',
    startDate: new Date(2023, 4, 1).toISOString(),
    endDate: new Date(2023, 7, 31).toISOString(),
    budget: 50000,
    createdAt: new Date(2023, 3, 15).toISOString(),
  },
  {
    id: '2',
    name: 'Website Redesign',
    description: 'Redesigning the company website for Globex Industries',
    status: 'planning',
    clientId: '2',
    startDate: new Date(2023, 5, 15).toISOString(),
    endDate: new Date(2023, 8, 15).toISOString(),
    budget: 15000,
    createdAt: new Date(2023, 5, 1).toISOString(),
  },
];

const generateMockLeads = (): Lead[] => [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    phone: '555-333-1111',
    company: 'InnoTech',
    status: 'qualified',
    source: 'Website',
    createdAt: new Date(2023, 5, 5).toISOString(),
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@bigfirm.com',
    phone: '555-444-2222',
    company: 'Big Firm Inc',
    status: 'contacted',
    source: 'Referral',
    createdAt: new Date(2023, 5, 10).toISOString(),
  },
];

// Main store interface
interface StoreState {
  users: User[];
  clients: Client[];
  tasks: Task[];
  projects: Project[];
  leads: Lead[];
  tickets: Ticket[];
  messages: Message[];
  calendarEvents: CalendarEvent[];
  documents: Document[];
  interns: Intern[];
  attendance: Attendance[];
  theme: 'light' | 'dark';
  
  // Current user (for UI purposes without auth)
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // CRUD operations
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Lead;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  toggleTheme: () => void;
}

// Create the store with persist middleware to save to localStorage
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      users: generateMockUsers(),
      clients: generateMockClients(),
      tasks: generateMockTasks(),
      projects: generateMockProjects(),
      leads: generateMockLeads(),
      tickets: [],
      messages: [],
      calendarEvents: [],
      documents: [],
      interns: [],
      attendance: [],
      theme: 'light',
      currentUser: { id: '1', email: 'admin@crmnexus.com', fullName: 'System Administrator', role: 'admin' },
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      addClient: (client) => {
        const newClient = { 
          ...client, 
          id: uuidv4(), 
          createdAt: new Date().toISOString() 
        };
        set((state) => ({ clients: [...state.clients, newClient as Client] }));
        return newClient as Client;
      },
      
      updateClient: (id, updatedClient) => {
        set((state) => ({
          clients: state.clients.map((client) => 
            client.id === id ? { ...client, ...updatedClient } : client
          ),
        }));
      },
      
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
      },
      
      addTask: (task) => {
        const newTask = { 
          ...task, 
          id: uuidv4(), 
          createdAt: new Date().toISOString() 
        };
        set((state) => ({ tasks: [...state.tasks, newTask as Task] }));
        return newTask as Task;
      },
      
      updateTask: (id, updatedTask) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      addProject: (project) => {
        const newProject = { 
          ...project, 
          id: uuidv4(), 
          createdAt: new Date().toISOString() 
        };
        set((state) => ({ projects: [...state.projects, newProject as Project] }));
        return newProject as Project;
      },
      
      updateProject: (id, updatedProject) => {
        set((state) => ({
          projects: state.projects.map((project) => 
            project.id === id ? { ...project, ...updatedProject } : project
          ),
        }));
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));
      },
      
      addLead: (lead) => {
        const newLead = { 
          ...lead, 
          id: uuidv4(), 
          createdAt: new Date().toISOString() 
        };
        set((state) => ({ leads: [...state.leads, newLead as Lead] }));
        return newLead as Lead;
      },
      
      updateLead: (id, updatedLead) => {
        set((state) => ({
          leads: state.leads.map((lead) => 
            lead.id === id ? { ...lead, ...updatedLead } : lead
          ),
        }));
      },
      
      deleteLead: (id) => {
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== id),
        }));
      },
      
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        });
      },
    }),
    {
      name: 'crm-nexus-storage',
    }
  )
);

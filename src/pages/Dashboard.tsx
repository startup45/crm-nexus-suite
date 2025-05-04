
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Users, Briefcase, CheckSquare, UserPlus, Clock, DollarSign, LineChart as LineChartIcon } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { subscribeToCollection } from '@/lib/firebase';
import { toast } from 'sonner';
import DashboardCalendar from '@/components/DashboardCalendar';
import ChatBot from '@/components/ChatBot';

// Sample data for the dashboard
const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 7000 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 8000 },
];

const taskStatusData = [
  { name: 'Completed', value: 45 },
  { name: 'In Progress', value: 32 },
  { name: 'Pending', value: 18 },
  { name: 'Overdue', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch data from Firebase
    // Currently using mock data for demonstration
    
    const mockFetch = async () => {
      try {
        // In a real app, we would use the subscribeToCollection function here
        // Example: 
        // const unsubscribeClients = subscribeToCollection('clients', setClients);
        // const unsubscribeProjects = subscribeToCollection('projects', setProjects);
        // ...
        
        // Mock data for now
        setClients(new Array(14).fill(0).map((_, i) => ({ id: `client-${i}`, name: `Client ${i}` })));
        setProjects(new Array(8).fill(0).map((_, i) => ({ id: `project-${i}`, name: `Project ${i}` })));
        setTasks(new Array(23).fill(0).map((_, i) => ({ id: `task-${i}`, name: `Task ${i}` })));
        setLeads(new Array(5).fill(0).map((_, i) => ({ id: `lead-${i}`, name: `Lead ${i}` })));
        
        setIsLoading(false);
        
        // Return cleanup functions for the event listeners
        // return () => {
        //   unsubscribeClients();
        //   unsubscribeProjects();
        //   ...
        // }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setIsLoading(false);
      }
    };
    
    mockFetch();
  }, []);

  const overviewCards = [
    { 
      title: 'Total Clients',
      value: clients.length,
      description: 'Active clients',
      icon: <Users className="h-10 w-10 text-primary/80" />,
      change: '+2.5%',
      trend: 'up',
    },
    { 
      title: 'Projects',
      value: projects.length,
      description: 'In progress',
      icon: <Briefcase className="h-10 w-10 text-blue-500" />,
      change: '+5.2%',
      trend: 'up',
    },
    { 
      title: 'Tasks',
      value: tasks.length,
      description: 'Assigned tasks',
      icon: <CheckSquare className="h-10 w-10 text-green-500" />,
      change: '+12.0%',
      trend: 'up',
    },
    { 
      title: 'New Leads',
      value: leads.length,
      description: 'This month',
      icon: <UserPlus className="h-10 w-10 text-orange-500" />,
      change: '-0.8%',
      trend: 'down',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="dashboard-card">
                <CardHeader className="p-4">
                  <div className="h-8 w-1/2 animate-pulse rounded-md bg-muted"></div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-12 w-1/3 animate-pulse rounded-md bg-muted"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {overviewCards.map((card) => (
              <Card key={card.title} className="dashboard-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {card.description}
                    </CardDescription>
                  </div>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className={`text-sm ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {card.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Revenue Overview Chart */}
                  <Card className="dashboard-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Revenue Overview</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <CardDescription>Monthly revenue for the current year</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Tasks Status Chart */}
                  <Card className="dashboard-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Task Status</CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <CardDescription>Current status of all tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-[300px] items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={taskStatusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {taskStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="dashboard-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Upcoming Deadlines</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardDescription>Tasks and projects due soon</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="py-3 px-4 text-left font-medium">Name</th>
                            <th className="py-3 px-4 text-left font-medium">Type</th>
                            <th className="py-3 px-4 text-left font-medium">Deadline</th>
                            <th className="py-3 px-4 text-left font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4">Website Redesign</td>
                            <td className="py-3 px-4">Project</td>
                            <td className="py-3 px-4">Jun 15, 2025</td>
                            <td className="py-3 px-4"><span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">In Progress</span></td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">Quarterly Report</td>
                            <td className="py-3 px-4">Task</td>
                            <td className="py-3 px-4">Jun 10, 2025</td>
                            <td className="py-3 px-4"><span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800 dark:bg-red-900 dark:text-red-200">Overdue</span></td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4">Client Meeting</td>
                            <td className="py-3 px-4">Event</td>
                            <td className="py-3 px-4">Jun 8, 2025</td>
                            <td className="py-3 px-4"><span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">Confirmed</span></td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4">Marketing Campaign</td>
                            <td className="py-3 px-4">Project</td>
                            <td className="py-3 px-4">Jun 20, 2025</td>
                            <td className="py-3 px-4"><span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">Planning</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4">
                <Card className="dashboard-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Performance Analytics</CardTitle>
                      <LineChartIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <Card className="dashboard-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Lead Conversion</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={revenueData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/20)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Add Calendar to the Dashboard */}
          <div>
            <DashboardCalendar />
          </div>
        </div>
      </div>
      
      {/* Add ChatBot component */}
      <ChatBot />
    </MainLayout>
  );
};

export default Dashboard;

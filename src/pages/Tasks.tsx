
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, Plus, Search, Clock, AlertCircle, CheckCircle2, UserCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: string;
  project?: string;
  createdBy: string;
  createdAt: string;
}

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'completed', label: 'Completed' }
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { currentUser, hasPermission } = useAuth();
  const canCreate = hasPermission('tasks', 'create');
  const canUpdate = hasPermission('tasks', 'update');
  const canDelete = hasPermission('tasks', 'delete');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignedTo: '',
    dueDate: new Date().toISOString(),
    project: '',
  });
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // In a real application, this would fetch from Firebase
        // const taskData = await getDocuments('tasks');
        
        // Mock data for demonstration
        const mockTaskData = new Array(15).fill(0).map((_, i) => {
          const statusIndex = i % 4;
          const statusMap = ['todo', 'in_progress', 'in_review', 'completed'];
          const priorityMap = ['low', 'medium', 'high'];
          
          return {
            id: `task-${i}`,
            title: `Task ${i}`,
            description: `This is a description for task ${i}. It includes details about what needs to be done.`,
            status: statusMap[statusIndex] as 'todo' | 'in_progress' | 'in_review' | 'completed',
            priority: priorityMap[i % 3] as 'low' | 'medium' | 'high',
            assignedTo: `user-${i % 5}`,
            dueDate: new Date(new Date().setDate(new Date().getDate() + i)).toISOString(),
            project: i % 3 === 0 ? `Project ${Math.floor(i/3)}` : undefined,
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
          };
        });
        
        setTasks(mockTaskData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setFormData({
        ...formData,
        dueDate: newDate.toISOString(),
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignedTo: '',
      dueDate: new Date().toISOString(),
      project: '',
    });
    setDate(new Date());
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Task title is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app: await addDocument('tasks', { ...formData, createdBy: currentUser.uid });
      
      // Mock add for demonstration
      const newTask: Task = {
        id: `task-${tasks.length + 1}`,
        ...formData,
        createdBy: currentUser?.uid || 'unknown',
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
      
      toast.success('Task added successfully');
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter tasks based on search query and active tab
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
                         
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'my') return matchesSearch && task.assignedTo === currentUser?.uid;
    return matchesSearch && task.status === activeTab;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in_review':
        return <UserCheck className="h-4 w-4 text-amber-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <MainLayout requiredPermission={{ module: 'tasks', action: 'read' }}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tasks</h1>
          
          {canCreate && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Add Task</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleAddTask}>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                      Create a new task to keep track of your work.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title"
                        name="title"
                        placeholder="Enter task title" 
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the task"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value) => handleSelectChange('status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select 
                          value={formData.priority} 
                          onValueChange={(value) => handleSelectChange('priority', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="assignedTo">Assigned To</Label>
                        <Input 
                          id="assignedTo"
                          name="assignedTo"
                          placeholder="User ID"
                          value={formData.assignedTo}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={handleDateChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="project">Project (Optional)</Label>
                      <Input 
                        id="project"
                        name="project"
                        placeholder="Related project"
                        value={formData.project}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => {
                        resetForm();
                        setDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Task'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="my">My Tasks</TabsTrigger>
              <TabsTrigger value="todo">To Do</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="p-4">
                  <div className="h-6 w-3/4 rounded-md bg-muted"></div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-4 w-full rounded-md bg-muted mb-2"></div>
                  <div className="h-4 w-2/3 rounded-md bg-muted"></div>
                </CardContent>
                <CardFooter className="p-4">
                  <div className="h-5 w-1/3 rounded-md bg-muted"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {filteredTasks.length === 0 ? (
              <Card className="p-10 text-center">
                <p className="text-muted-foreground">No tasks found.</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <Card key={task.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                        </div>
                        {getPriorityBadge(task.priority)}
                      </div>
                      {task.project && (
                        <CardDescription className="mt-1">
                          Project: {task.project}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t p-4 bg-muted/20">
                      <div className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        {canUpdate && (
                          <Button variant="ghost" size="sm" className="h-8">
                            Edit
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Tasks;

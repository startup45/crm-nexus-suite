
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample support tickets
  const tickets = [
    {
      id: 'TICK-1001',
      title: 'Login issues after password reset',
      description: 'Unable to login after resetting password. The system shows invalid credentials.',
      status: 'open',
      priority: 'high',
      createdAt: '2024-05-01T10:30:00',
      createdBy: 'Jane Employee',
      assignedTo: 'System Administrator'
    },
    {
      id: 'TICK-1002',
      title: 'Dashboard data not loading',
      description: 'The dashboard charts and statistics are not loading properly.',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2024-04-28T14:15:00',
      createdBy: 'John Manager',
      assignedTo: 'System Administrator'
    },
    {
      id: 'TICK-1003',
      title: 'Need access to financial reports',
      description: 'Requesting access to view the financial reports section.',
      status: 'pending',
      priority: 'low',
      createdAt: '2024-04-25T09:45:00',
      createdBy: 'Sam Intern',
      assignedTo: null
    },
    {
      id: 'TICK-1004',
      title: 'Email notifications not working',
      description: 'Not receiving email notifications for new tasks.',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-04-20T11:00:00',
      createdBy: 'Jane Employee',
      assignedTo: 'System Administrator',
      resolvedAt: '2024-04-22T15:30:00'
    },
    {
      id: 'TICK-1005',
      title: 'Feature request: Dark mode toggle',
      description: 'Would like to have a dark mode option in the application.',
      status: 'closed',
      priority: 'low',
      createdAt: '2024-04-15T16:20:00',
      createdBy: 'John Manager',
      assignedTo: 'System Administrator',
      resolvedAt: '2024-04-18T10:15:00'
    }
  ];

  // Sample knowledge base articles
  const knowledgeBaseArticles = [
    {
      id: '1',
      title: 'How to reset your password',
      category: 'Account',
      views: 1245,
      lastUpdated: '2024-04-10'
    },
    {
      id: '2',
      title: 'Setting up 2FA for your account',
      category: 'Security',
      views: 980,
      lastUpdated: '2024-03-25'
    },
    {
      id: '3',
      title: 'Creating and managing projects',
      category: 'Projects',
      views: 1562,
      lastUpdated: '2024-04-15'
    },
    {
      id: '4',
      title: 'How to generate reports',
      category: 'Reports',
      views: 842,
      lastUpdated: '2024-04-05'
    },
    {
      id: '5',
      title: 'Inviting team members',
      category: 'Teams',
      views: 1105,
      lastUpdated: '2024-03-30'
    }
  ];

  // Status and priority colors
  const statusColors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    pending: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    urgent: 'bg-red-500 text-white'
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter tickets based on search
  const filteredTickets = searchQuery
    ? tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tickets;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Support</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>New Ticket</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>Submit a new support request or issue.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Brief description of the issue" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Please provide detailed information about your issue"
                    rows={4} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select 
                    id="priority" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Submit Ticket</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="tickets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
                <CardDescription>View and manage all support requests.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[ticket.status] || ''}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[ticket.priority] || ''}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                        <TableCell>{ticket.assignedTo || '—'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search knowledge base..."
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">Account</Button>
                    <Button variant="ghost" className="w-full justify-start">Security</Button>
                    <Button variant="ghost" className="w-full justify-start">Projects</Button>
                    <Button variant="ghost" className="w-full justify-start">Reports</Button>
                    <Button variant="ghost" className="w-full justify-start">Teams</Button>
                    <Button variant="ghost" className="w-full justify-start">General</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Popular Articles</CardTitle>
                  <CardDescription>Most viewed help articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {knowledgeBaseArticles.map((article) => (
                      <div key={article.id} className="border-b pb-4">
                        <h3 className="font-medium text-lg hover:text-primary cursor-pointer">
                          {article.title}
                        </h3>
                        <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
                          <Badge variant="outline">{article.category}</Badge>
                          <div className="flex items-center gap-2">
                            <span>{article.views} views</span>
                            <span>•</span>
                            <span>Updated {article.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline">View All Articles</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Support;

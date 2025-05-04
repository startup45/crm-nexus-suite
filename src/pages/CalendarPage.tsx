
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isSameDay } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';

interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  allDay: boolean;
  type: 'meeting' | 'deadline' | 'reminder';
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sample events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly progress review',
      date: new Date(2024, 4, 5), // May 5, 2024
      time: '10:00 AM',
      allDay: false,
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Project Deadline',
      description: 'Final submission for Website Redesign',
      date: new Date(2024, 4, 15), // May 15, 2024
      allDay: true,
      type: 'deadline'
    },
    {
      id: '3',
      title: 'Client Call',
      description: 'Discussion with Acme Corp about new requirements',
      date: new Date(), // Today
      time: '02:30 PM',
      allDay: false,
      type: 'meeting'
    },
    {
      id: '4',
      title: 'Send Invoice',
      description: 'Invoice for Globex Industries',
      date: new Date(), // Today
      allDay: true,
      type: 'reminder'
    }
  ];

  // Filter events for the selected date
  const filteredEvents = events.filter(event => 
    selectedDate && isSameDay(event.date, selectedDate)
  );

  // Get background color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800';
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new event on your calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" placeholder="Team Meeting" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input id="description" placeholder="Discuss project progress" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      defaultValue={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="all-day" />
                  <Label htmlFor="all-day">All day event</Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-type">Event Type</Label>
                  <select id="event-type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsDialogOpen(false)}>Add Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6">
          <div>
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </CardTitle>
                <CardDescription>
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEvents.map((event) => (
                      <div key={event.id} className={`p-4 rounded-md border ${getEventColor(event.type)}`}>
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-lg">{event.title}</h3>
                          <span className="text-xs uppercase px-2 py-1 rounded-full bg-background">
                            {event.type}
                          </span>
                        </div>
                        {event.description && (
                          <p className="mt-2 text-sm">{event.description}</p>
                        )}
                        <div className="mt-2 flex items-center text-xs">
                          {event.allDay ? (
                            <span>All day</span>
                          ) : (
                            <span>{event.time}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No events scheduled for this day.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                      Add Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events scheduled in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(event.date, 'MMM d')} {event.time ? `• ${event.time}` : '• All day'}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${event.type === 'meeting' ? 'bg-blue-500' : event.type === 'deadline' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;

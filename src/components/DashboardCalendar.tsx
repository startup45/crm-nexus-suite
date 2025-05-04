
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'meeting' | 'deadline' | 'reminder';
}

const DashboardCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Sample events for the calendar
  const events: CalendarEvent[] = [
    {
      id: '1',
      date: new Date(2024, 4, 4), // May 4, 2024
      title: 'Team Meeting',
      type: 'meeting'
    },
    {
      id: '2',
      date: new Date(2024, 4, 8), // May 8, 2024
      title: 'Project Deadline',
      type: 'deadline'
    },
    {
      id: '3',
      date: new Date(2024, 4, 15), // May 15, 2024
      title: 'Client Presentation',
      type: 'meeting'
    },
    {
      id: '4',
      date: new Date(), // Today
      title: 'Follow-up with leads',
      type: 'reminder'
    },
    {
      id: '5',
      date: new Date(2024, 4, 20), // May 20, 2024
      title: 'Quarterly Review',
      type: 'meeting'
    }
  ];

  // Filter events for the selected date
  const selectedDateEvents = date 
    ? events.filter(event => isSameDay(event.date, date))
    : [];

  // Get type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'deadline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Function to highlight dates with events
  const dayClassNames = (day: Date) => {
    const isEventDate = events.some(event => isSameDay(event.date, day));
    return isEventDate ? 'bg-primary/10 font-bold' : undefined;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pl-2 pr-2 pb-2">
        <div className="flex flex-col gap-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border pointer-events-auto"
            classNames={{
              day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
              day: (props) => dayClassNames(props.date)
            }}
          />
          
          <div className="px-2">
            <h3 className="font-medium text-sm">
              {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            <div className="mt-2 space-y-2">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-2 text-sm">
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                    <span>{event.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCalendar;

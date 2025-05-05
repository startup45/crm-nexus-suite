import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarDays, Play, Square } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAttendanceTimer } from '@/hooks/useAttendanceTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Attendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const isMobile = useIsMobile();
  const { isActive, startTime, startTimer, stopTimer } = useAttendanceTimer();
  
  // Sample attendance data (in a real app would come from the store)
  const attendance = [
    {
      id: '1',
      userId: '3',
      userName: 'Jane Employee',
      date: '2024-05-01',
      checkIn: '09:05',
      checkOut: '17:30',
      status: 'present'
    },
    {
      id: '2',
      userId: '2',
      userName: 'John Manager',
      date: '2024-05-01',
      checkIn: '08:45',
      checkOut: '18:15',
      status: 'present'
    },
    {
      id: '3',
      userId: '4',
      userName: 'Sam Intern',
      date: '2024-05-01',
      checkIn: '09:20',
      checkOut: '17:00',
      status: 'late'
    },
    {
      id: '4',
      userId: '3',
      userName: 'Jane Employee',
      date: '2024-04-30',
      checkIn: '09:00',
      checkOut: '17:15',
      status: 'present'
    },
    {
      id: '5',
      userId: '2',
      userName: 'John Manager',
      date: '2024-04-30',
      checkIn: '',
      checkOut: '',
      status: 'absent'
    }
  ];

  // Sample employees list
  const employees = [
    { id: '1', name: 'System Administrator' },
    { id: '2', name: 'John Manager' },
    { id: '3', name: 'Jane Employee' },
    { id: '4', name: 'Sam Intern' }
  ];

  const statusColors: Record<string, string> = {
    present: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    half_day: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };

  // Filter attendance records based on selected date and employee
  const filteredAttendance = attendance.filter(record => {
    const recordDate = format(new Date(record.date), 'yyyy-MM-dd');
    const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
    
    const dateMatches = recordDate === selectedDateStr;
    const employeeMatches = selectedEmployee === 'all' || record.userId === selectedEmployee;
    
    return dateMatches && employeeMatches;
  });

  // Calculate current time spent if timer is active
  const calculateElapsedTime = () => {
    if (!isActive || !startTime) return "00:00:00";
    
    const now = new Date();
    const elapsed = now.getTime() - startTime.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
        
        {/* Timer Card */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Attendance Timer</CardTitle>
            <CardDescription>Track your working hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div className="text-3xl font-mono bg-muted p-4 rounded-md w-full text-center">
                {calculateElapsedTime()}
              </div>
              <div className="flex gap-4 mt-4">
                <Button 
                  onClick={startTimer} 
                  disabled={isActive} 
                  variant="default"
                  className="w-28"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </Button>
                <Button 
                  onClick={stopTimer} 
                  disabled={!isActive}
                  variant="destructive"
                  className="w-28"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </div>
              {startTime && (
                <p className="text-sm text-muted-foreground mt-2">
                  Started at: {format(startTime, 'HH:mm:ss')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {isMobile ? (
          <Tabs defaultValue="filters" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
            </TabsList>
            
            <TabsContent value="filters" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Employee</p>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="records">
              <AttendanceRecords 
                filteredAttendance={filteredAttendance} 
                statusColors={statusColors} 
                isMobile={true}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Employee</p>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <AttendanceRecords 
              filteredAttendance={filteredAttendance} 
              statusColors={statusColors} 
              isMobile={false}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

// Extracted component for attendance records to reduce code duplication
const AttendanceRecords = ({ 
  filteredAttendance, 
  statusColors, 
  isMobile 
}: { 
  filteredAttendance: any[],
  statusColors: Record<string, string>,
  isMobile: boolean
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
        <CardDescription>
          {filteredAttendance.length > 0 
            ? `Found ${filteredAttendance.length} records` 
            : 'Select a date to view records'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredAttendance.length > 0 ? (
          isMobile ? (
            <div className="space-y-4">
              {filteredAttendance.map((record) => {
                // Calculate duration if both check-in and check-out exist
                let duration = '';
                if (record.checkIn && record.checkOut) {
                  const checkInTime = new Date(`2000-01-01T${record.checkIn}`);
                  const checkOutTime = new Date(`2000-01-01T${record.checkOut}`);
                  const diffMs = checkOutTime.getTime() - checkInTime.getTime();
                  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  duration = `${diffHrs}h ${diffMins}m`;
                }

                return (
                  <div key={record.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{record.userName}</h3>
                      <Badge className={statusColors[record.status] || ''}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 text-sm gap-2">
                      <div>Check In: <span className="font-medium">{record.checkIn || '-'}</span></div>
                      <div>Check Out: <span className="font-medium">{record.checkOut || '-'}</span></div>
                    </div>
                    {duration && (
                      <div className="text-sm">Duration: <span className="font-medium">{duration}</span></div>
                    )}
                    <Button variant="ghost" size="sm" className="w-full mt-2">Edit</Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => {
                  // Calculate duration if both check-in and check-out exist
                  let duration = '';
                  if (record.checkIn && record.checkOut) {
                    const checkInTime = new Date(`2000-01-01T${record.checkIn}`);
                    const checkOutTime = new Date(`2000-01-01T${record.checkOut}`);
                    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
                    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                    duration = `${diffHrs}h ${diffMins}m`;
                  }

                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.userName}</TableCell>
                      <TableCell>{record.checkIn || '-'}</TableCell>
                      <TableCell>{record.checkOut || '-'}</TableCell>
                      <TableCell>{duration || '-'}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[record.status] || ''}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No attendance records found for the selected date and employee.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Attendance;

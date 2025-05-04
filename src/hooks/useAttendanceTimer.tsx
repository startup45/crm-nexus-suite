
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

export function useAttendanceTimer() {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { currentUser, attendance } = useStore((state) => ({
    currentUser: state.currentUser,
    attendance: state.attendance
  }));
  
  const isMobile = useIsMobile();

  // Handle visibility change to stop timer if user switches tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isActive) {
        stopTimer();
        toast.info("Timer stopped - you left the page");
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive]);

  // Auto-end day at midnight
  useEffect(() => {
    if (!isActive) return;
    
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 0, 0);
    const timeUntilEndOfDay = endOfDay.getTime() - now.getTime();

    const endDayTimer = setTimeout(() => {
      if (isActive) {
        stopTimer();
        toast.info("Your workday has been automatically ended");
      }
    }, timeUntilEndOfDay);

    return () => clearTimeout(endDayTimer);
  }, [isActive]);

  const startTimer = () => {
    const now = new Date();
    setStartTime(now);
    setIsActive(true);
    
    // Create attendance record with check-in
    if (currentUser) {
      const newAttendance = {
        id: crypto.randomUUID(),
        userId: currentUser.id,
        date: format(now, 'yyyy-MM-dd'),
        checkIn: format(now, 'HH:mm'),
        checkOut: null,
        status: 'present'
      };
      
      // In a real app, this would be saved to the store
      toast.success("Check-in recorded");
    }
  };

  const stopTimer = () => {
    if (!isActive || !startTime) return;
    
    const now = new Date();
    const duration = now.getTime() - startTime.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    setIsActive(false);
    setStartTime(null);

    // Update attendance record with check-out
    if (currentUser) {
      // In a real app, this would update the store
      toast.success(`Check-out recorded. Worked for ${hours}h ${minutes}m`);
    }
    
    // Generate report (in a real app would store this)
    return {
      date: format(now, 'yyyy-MM-dd'),
      duration: `${hours}h ${minutes}m`,
      checkIn: startTime ? format(startTime, 'HH:mm') : '',
      checkOut: format(now, 'HH:mm')
    };
  };

  return {
    isActive,
    startTime,
    startTimer,
    stopTimer
  };
}

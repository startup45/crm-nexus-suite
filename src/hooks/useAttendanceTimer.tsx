
import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

export function useAttendanceTimer() {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  
  // Use refs to minimize re-renders and dependency changes
  const currentAttendanceRef = useRef<{ id: string } | null>(null);
  
  // Get store functions without triggering re-renders when state changes
  const { currentUser, addAttendance, updateAttendance } = useStore();
  
  // Extract timer stopping logic to a reusable function to avoid code duplication
  const stopTimer = useCallback(() => {
    if (!isActive || !startTime) return;
    
    const now = new Date();
    const duration = now.getTime() - startTime.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    setIsActive(false);
    
    // Update attendance record with check-out
    if (currentUser && currentAttendanceRef.current) {
      updateAttendance(currentAttendanceRef.current.id, {
        checkOut: format(now, 'HH:mm')
      });
      
      toast.success(`Check-out recorded. Worked for ${hours}h ${minutes}m`);
    }
    
    setStartTime(null);
    
    // Generate report
    return {
      date: format(now, 'yyyy-MM-dd'),
      duration: `${hours}h ${minutes}m`,
      checkIn: startTime ? format(startTime, 'HH:mm') : '',
      checkOut: format(now, 'HH:mm')
    };
  }, [isActive, startTime, currentUser, updateAttendance]);
  
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
  }, [isActive, stopTimer]);

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
  }, [isActive, stopTimer]);

  const startTimer = useCallback(() => {
    const now = new Date();
    setStartTime(now);
    setIsActive(true);
    
    // Create attendance record with check-in
    if (currentUser) {
      const newAttendance = {
        userId: currentUser.id,
        date: format(now, 'yyyy-MM-dd'),
        checkIn: format(now, 'HH:mm'),
        checkOut: null,
        status: 'present' as const // Explicitly type as 'present'
      };
      
      // Add the attendance record to the store
      const record = addAttendance(newAttendance);
      currentAttendanceRef.current = record;
      toast.success("Check-in recorded");
    }
  }, [currentUser, addAttendance]);

  return {
    isActive,
    startTime,
    startTimer,
    stopTimer
  };
}

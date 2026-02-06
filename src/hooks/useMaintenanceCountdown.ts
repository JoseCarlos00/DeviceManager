import { useEffect, useState } from 'react';
import { useMaintenanceModeStore } from '@/stores/useMaintenanceModeStore';

export function useMaintenanceCountdown() {
  const { isMaintenanceMode, data } = useMaintenanceModeStore();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    
    if (!isMaintenanceMode || !data) {
      setTimeRemaining(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, data.untilTimestampMs - Date.now());
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    

    return () => clearInterval(interval);
  }, [isMaintenanceMode, data]);

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  return {
    timeRemaining,
    hours,
    minutes,
    seconds,
    formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
  };
}

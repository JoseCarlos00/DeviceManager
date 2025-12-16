import { useCallback } from 'react';
import type { Device } from '@/types';

export const useDeviceState = (
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>,
  fetchDevices: () => void
) => {
  const updateDeviceInState = useCallback((androidId: string, updates: Partial<Device>) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.androidId === androidId ? { ...device, ...updates } : device
      )
    );
  }, [setDevices]);

  const addOrUpdateDevice = useCallback(
    (androidId: string, updates: Partial<Device>) => {
      setDevices((prev) => {
        const exists = prev.some((d) => d.androidId === androidId);
        if (exists) {
          return prev.map((device) =>
            device.androidId === androidId ? { ...device, ...updates } : device
          );
        } else {
          fetchDevices();
          return prev;
        }
      });
    },
    [setDevices, fetchDevices]
  );

  return { updateDeviceInState, addOrUpdateDevice };
}

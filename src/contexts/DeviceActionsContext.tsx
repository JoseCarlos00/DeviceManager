// contexts/DeviceActionsContext.tsx
import { createContext, useContext } from 'react';
import type { ClientToServerEvents } from '@/types/websocket';

type DeviceActionsContextValue = Pick<ClientToServerEvents, 'SEND_MESSAGE' | 'SEND_PING' | 'ALARM_ACTIVATE'> & {
	isConnected: boolean;
};


const DeviceActionsContext = createContext<DeviceActionsContextValue | null>(null);

export const useDeviceActions = () => {
	const context = useContext(DeviceActionsContext);
	if (!context) throw new Error('useDeviceActions must be used within DeviceActionsProvider');
	return context;
};

export const DeviceActionsProvider = DeviceActionsContext.Provider;

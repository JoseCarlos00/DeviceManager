// contexts/DeviceActionsContext.tsx
import { createContext, useContext } from 'react';
import type { ClientToServerEvents } from '@/types/websocket';

interface DeviceActionsContextValue extends ClientToServerEvents {
	isConnected: boolean;
	messageRowId: string | null;
	messageText: string;
	setMessageRowId: (id: string | null) => void;
	setMessageText: (text: string) => void;
}

const DeviceActionsContext = createContext<DeviceActionsContextValue | null>(null);

export const useDeviceActions = () => {
	const context = useContext(DeviceActionsContext);
	if (!context) throw new Error('useDeviceActions must be used within DeviceActionsProvider');
	return context;
};

export const DeviceActionsProvider = DeviceActionsContext.Provider;

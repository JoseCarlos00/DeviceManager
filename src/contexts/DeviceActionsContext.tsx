// contexts/DeviceActionsContext.tsx
import { createContext, useContext } from 'react';
import type { ClientToServerEvents } from '@/types/websocket';
import type { Device } from "@/types/index";

// Ahora el valor del contexto incluye TODAS las acciones definidas en ClientToServerEvents
type DeviceActionsContextValue = Pick<ClientToServerEvents, 'SEND_MESSAGE' | 'SEND_PING' | 'ALARM_ACTIVATE' | 'SEND_BROADCAST_MESSAGE' | 'SET_MAINTENANCE_MODE' | 'CHECK_FOR_UPDATE_BROADCAST'> & {
	isConnected: boolean;
	devices: Device[];
	isRefreshing: boolean;
	refresh: () => void;
};

const DeviceActionsContext = createContext<DeviceActionsContextValue | null>(null);

export const useDeviceActions = () => {
	const context = useContext(DeviceActionsContext);
	if (!context) throw new Error('useDeviceActions must be used within DeviceActionsProvider');
	return context;
};

export const DeviceActionsProvider = DeviceActionsContext.Provider;

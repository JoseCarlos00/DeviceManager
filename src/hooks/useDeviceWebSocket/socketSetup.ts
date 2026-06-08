// hooks/useDeviceWebSocket/socketSetup.ts
import { io, Socket } from 'socket.io-client';
import { SOCKET_CONFIG } from '@/config/socket';
import { createConnectionHandlers, createDeviceHandlers, createDataHandlers } from './handlers';
import type { Device } from '@/types'
import { receivedEventServer } from "@/lib/constants";

interface SetupSocketParams {
	setIsConnected: (value: boolean) => void;
	fetchDevices: () => void;
	updateDeviceInState: (androidId: string, updates: Partial<Device>) => void;
	addOrUpdateDevice: (androidId: string, updates: Partial<Device>) => void;
}

export const setupSocket = ({
	setIsConnected,
	fetchDevices,
	updateDeviceInState,
	addOrUpdateDevice,
}: SetupSocketParams): Socket => {
	// Crear socket
	const socket = io('/', SOCKET_CONFIG);

	// Crear handlers
	const connectionHandlers = createConnectionHandlers(setIsConnected, fetchDevices);
	const deviceHandlers = createDeviceHandlers(updateDeviceInState, addOrUpdateDevice);
	const dataHandlers = createDataHandlers(fetchDevices);

	// ============ REGISTRAR EVENTOS DE CONEXIÓN ============

	socket.on('connect', () => connectionHandlers.onConnect(socket));
	socket.on('disconnect', (reason) => connectionHandlers.onDisconnect(reason, socket));
	socket.on('connect_error', connectionHandlers.onConnectError);
	socket.on('reconnect_error', connectionHandlers.onReconnectError);
	socket.on('reconnect', connectionHandlers.onReconnect);
	socket.on('reconnecting', connectionHandlers.onReconnecting);
	socket.on('error', connectionHandlers.onError);

	// ============ REGISTRAR EVENTOS DE DISPOSITIVOS ============

	socket.on(receivedEventServer.DEVICE_CONNECTED, deviceHandlers.onDeviceConnected);
	socket.on(receivedEventServer.DEVICE_RECONNECTED, deviceHandlers.onDeviceReconnected);
	socket.on(receivedEventServer.DEVICE_DISCONNECTED, deviceHandlers.onDeviceDisconnected);

	// ============ REGISTRAR EVENTOS DE DATOS ============

	socket.on(receivedEventServer.DATA_MODIFIED, dataHandlers.onDataModified);

	return socket;
};

export const cleanupSocket = (socket: Socket | null, timeoutId: number | null) => {
	console.log('[WebSocket] 🧹 Limpiando conexión...');

	if (timeoutId) {
		clearTimeout(timeoutId);
	}

	if (socket) {
		socket.close();
	}
};

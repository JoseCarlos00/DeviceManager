// hooks/useDeviceWebSocket/handlers.ts
import { toast } from 'sonner';
import type { Socket } from 'socket.io-client';
import type { Device, DeviceStatusEvent } from '@/types';
import { submittedEventServer } from '@/lib/constants'

// ============ HANDLERS DE CONEXIÓN ============

export const createConnectionHandlers = (setIsConnected: (value: boolean) => void, fetchDevices: () => void) => {
	const onConnect = (socket: Socket) => {
		console.log('[WebSocket] ✅ Conectado al servidor');
		setIsConnected(true);

		socket.emit(submittedEventServer.IDENTIFY_CLIENT, { clientType: 'WEB' });

		toast.success('Conexión establecida', {
			description: 'Recibiendo actualizaciones en tiempo real',
		});

		// Sincronizar datos al conectar
		fetchDevices();
	};

	const onDisconnect = (reason: string, socket: Socket) => {
		console.log('[WebSocket] ❌ Desconectado:', reason);
		setIsConnected(false);

		if (reason === 'io server disconnect') {
			socket.connect();
		}

		// Ignorar desconexiones iniciadas por el cliente (navegación/desmontaje)
		if (reason === 'io client disconnect') {
			return;
		}

		toast.warning('Conexión perdida', {
			description: 'Intentando reconectar...',
		});
	};

	const onConnectError = (error: Error) => {
		console.error('[WebSocket] 💥 Error de conexión:', error);
		setIsConnected(false);
	};

	const onReconnectError = (error: Error) => {
		console.error('[WebSocket] Error al reconectar:', error.message);
	};

	const onReconnect = (attemptNumber: number) => {
		console.log('[WebSocket] Reconectado exitosamente después de', attemptNumber, 'intentos');
	};

	const onReconnecting = (attemptNumber: number) => {
		console.log('[WebSocket] Intentando reconectar (intento #', attemptNumber, ')');
	};

	const onError = (data: unknown) => {
		console.error('[WebSocket] Error genérico:', data);
	};

	return {
		onConnect,
		onDisconnect,
		onConnectError,
		onReconnectError,
		onReconnect,
		onReconnecting,
		onError,
	};
};

// ============ HANDLERS DE DISPOSITIVOS ============

export const createDeviceHandlers = (
	updateDeviceInState: (androidId: string, updates: Partial<Device>) => void,
	addOrUpdateDevice: (androidId: string, updates: Partial<Device>) => void
) => {
	const onDeviceConnected = (data: DeviceStatusEvent) => {
		console.log('[WebSocket] 🟢 Dispositivo conectado:', data.deviceId);

		addOrUpdateDevice(data.deviceId, {
			online: true,
			appVersion: data.appVersion,
		});

		toast.info('Dispositivo conectado', {
			description: `${data.deviceId} ahora está online`,
		});
	};

	const onDeviceReconnected = (data: DeviceStatusEvent) => {
		console.log('[WebSocket] 🔄 Dispositivo reconectado:', data.deviceId);

		updateDeviceInState(data.deviceId, {
			online: true,
			appVersion: data.appVersion,
		});

		toast.success('Dispositivo reconectado', {
			description: `${data.deviceId} volvió a conectarse`,
		});
	};

	const onDeviceDisconnected = (data: DeviceStatusEvent) => {
		console.log('[WebSocket] 🔴 Dispositivo desconectado:', data.deviceId);

		updateDeviceInState(data.deviceId, {
			online: false,
		});

		toast.warning('Dispositivo desconectado', {
			description: `${data.deviceId} está offline`,
		});
	};

	return {
		onDeviceConnected,
		onDeviceReconnected,
		onDeviceDisconnected,
	};
};

// ============ HANDLERS DE DATOS ============

export const createDataHandlers = (fetchDevices: () => void) => {
	const onDataModified = () => {
		toast.info('Datos modificados, actualizando lista de  dispositivos...')
		fetchDevices();
	};

	return {
		onDataModified,
	};
};

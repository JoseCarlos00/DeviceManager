// hooks/useDeviceWebSocket.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import type { Device } from '@/types';

interface DeviceStatusEvent {
	deviceId: string;
	battery?: number;
	charging?: boolean;
	timestamp: number;
	lastSeen?: number;
}

export function useDeviceWebSocket() {
	const [devices, setDevices] = useState<Device[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(true);

	const socketRef = useRef<Socket | null>(null);
	const reconnectTimeoutRef = useRef<number | null>(null);

	// ============ FUNCIÓN FETCH DISPOSITIVOS ============
	const fetchDevices = useCallback(async () => {
		setIsRefreshing(true);
		try {
			const response = await apiClient.get('/inventory/devices');
			
			setDevices(response.data?.data);
		} catch (error) {
			console.error('[WebSocket] Error fetching devices:', error);
			toast.error('Error al actualizar dispositivos');
		} finally {
			setIsRefreshing(false);
		}
	}, []); // ⭐ Sin dependencias

	// ============ FUNCIONES DE ACTUALIZACIÓN DE ESTADO ============

	// Actualizar un dispositivo existente
	const updateDeviceInState = useCallback((androidId: string, updates: Partial<Device>) => {
		setDevices((prev) => prev.map((device) => (device.androidId === androidId ? { ...device, ...updates } : device)));
	}, []); // ⭐ Sin dependencias

	// Agregar o actualizar dispositivo
	const addOrUpdateDevice = useCallback(
		(androidId: string, updates: Partial<Device>) => {
			setDevices((prev) => {
				const exists = prev.some((d) => d.androidId === androidId);

				if (exists) {
					return prev.map((device) => (device.androidId === androidId ? { ...device, ...updates } : device));
				} else {
					// Si no existe, hacer fetch completo
					fetchDevices();
					return prev;
				}
			});
		},
		[fetchDevices]
	);

	// ============ EFECTO PRINCIPAL - WEBSOCKET + FETCH INICIAL ============
	useEffect(() => {
		// 1. Fetch inicial de dispositivos
		fetchDevices();

		// 2. Configurar WebSocket
		const socket = io('/', {
			withCredentials: true,
			transports: ['websocket', 'polling'],
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			query: {
				clientType: 'WEB_CLIENT',
			},
		});

		socketRef.current = socket;

		// ============ EVENTOS DE CONEXIÓN ============

		socket.on('connect', () => {
			console.log('[WebSocket] ✅ Conectado al servidor');
			setIsConnected(true);

			socket.emit('IDENTIFY_CLIENT', { clientType: 'WEB' });

			toast.success('Conexión establecida', {
				description: 'Recibiendo actualizaciones en tiempo real',
			});

			// Al reconectar, sincronizar datos
			fetchDevices();
		});

		socket.on('disconnect', (reason) => {
			console.log('[WebSocket] ❌ Desconectado:', reason);
			setIsConnected(false);

			if (reason === 'io server disconnect') {
				socket.connect();
			}

			toast.warning('Conexión perdida', {
				description: 'Intentando reconectar...',
			});
		});

		socket.on('connect_error', (error) => {
			console.error('[WebSocket] 💥 Error de conexión:', error);
			setIsConnected(false);
		});

		socket.on('reconnect_error', (err) => {
			console.error('Error al reconectar:', err.message);
		});

		socket.on('reconnect', (attemptNumber) => {
			console.log('Reconectado exitosamente después de', attemptNumber, 'intentos');
		});

		socket.on('reconnecting', (attemptNumber) => {
			console.log('Intentando reconectar (intento #', attemptNumber, ')');
		});

		// 5. Escuchar eventos genéricos de error
		socket.on('error', (data) => {
			console.error('Error genérico de Socket.IO:', data);
		});

		// ============ EVENTOS DE DISPOSITIVOS ============

		socket.on('device:connected', (data: DeviceStatusEvent) => {
			console.log('[WebSocket] 🟢 Dispositivo conectado:', data.deviceId);

			addOrUpdateDevice(data.deviceId, {
				online: true,
			});

			toast.info('Dispositivo conectado', {
				description: `${data.deviceId} ahora está online`,
			});
		});

		socket.on('device:reconnected', (data: DeviceStatusEvent) => {
			console.log('[WebSocket] 🔄 Dispositivo reconectado:', data.deviceId);

			updateDeviceInState(data.deviceId, {
				online: true,
			});

			toast.success('Dispositivo reconectado', {
				description: `${data.deviceId} volvió a conectarse`,
			});
		});

		socket.on('device:disconnected', (data: DeviceStatusEvent) => {
			console.log('[WebSocket] 🔴 Dispositivo desconectado:', data.deviceId);

			updateDeviceInState(data.deviceId, {
				online: false,
			});

			toast.warning('Dispositivo desconectado', {
				description: `${data.deviceId} está offline`,
			});
		});

		socket.on('device:battery:update', (data: DeviceStatusEvent) => {
			console.log('[WebSocket] 🔋 Actualización de batería:', data.deviceId, data.battery);

			// Si tu tipo Device tiene campos de batería:
			// updateDeviceInState(data.deviceId, {
			//   battery: data.battery,
			//   charging: data.charging
			// });
		});

		// ============ EVENTO DATA_MODIFIED ============

		socket.on('data:modified', (res) => {
			console.log('res:', res);

			console.log('[WebSocket] 🔄 Datos modificados, refrescando...');
			fetchDevices();
		});

		// ============ CLEANUP ============
		const socketInstance = socketRef.current;
		const timeoutId = reconnectTimeoutRef.current;

		return () => {
			console.log('[WebSocket] 🧹 Limpiando conexión...');

			if (timeoutId) clearTimeout(timeoutId);
			if (socketInstance) socketInstance.close();
		};
	}, [fetchDevices, updateDeviceInState, addOrUpdateDevice]);

	// ============ FUNCIÓN MANUAL DE REFRESH ============
	const refresh = useCallback(() => {
		fetchDevices();
	}, [fetchDevices]);

	// ============ RETURN ============
	return {
		devices,
		isConnected,
		isRefreshing,
		refresh,
	};
}

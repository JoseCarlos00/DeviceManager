import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type { Socket } from 'socket.io-client';
import { apiClient } from '@/lib/api';
import type { Device } from '@/types';
import { setupSocket, cleanupSocket } from './socketSetup';
import { submittedEventServer } from '@/lib/constants'

export function useDeviceWebSocket() {
	const [devices, setDevices] = useState<Device[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(true);

	const socketRef = useRef<Socket | null>(null);
	const reconnectTimeoutRef = useRef<number | null>(null);

	// ============ FETCH DISPOSITIVOS ============

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
	}, []);

	// ============ ACTUALIZACIÓN DE ESTADO ============

	const updateDeviceInState = useCallback((androidId: string, updates: Partial<Device>) => {
		setDevices((prev) => prev.map((device) => (device.androidId === androidId ? { ...device, ...updates } : device)));
	}, []);

	const addOrUpdateDevice = useCallback(
		(androidId: string, updates: Partial<Device>) => {
			setDevices((prev) => {
				const exists = prev.some((d) => d.androidId === androidId);

				if (exists) {
					return prev.map((device) => (device.androidId === androidId ? { ...device, ...updates } : device));
				} else {
					fetchDevices();
					return prev;
				}
			});
		},
		[fetchDevices]
	);

	// ============ CONFIGURACIÓN WEBSOCKET ============

	useEffect(() => {
		// Fetch inicial
		fetchDevices();

		// Configurar socket con todos los event listeners
		const socket = setupSocket({
			setIsConnected,
			fetchDevices,
			updateDeviceInState,
			addOrUpdateDevice,
		});

		socketRef.current = socket;

		// Cleanup
		const socketInstance = socketRef.current;
		const timeoutId = reconnectTimeoutRef.current;

		return () => {
			cleanupSocket(socketInstance, timeoutId);
		};
	}, [fetchDevices, updateDeviceInState, addOrUpdateDevice]);

	// ============ EMISIÓN DE EVENTOS ============

	const sendMessage = useCallback((payload: unknown) => {
		if (socketRef.current && socketRef.current.connected) {
			socketRef.current.emit(submittedEventServer.SEND_MESSAGE, payload);
		} else {
			console.warn('[WebSocket] No se pudo enviar el mensaje, el socket no está conectado.');
			toast.warning('No se pudo realizar la acción', {
				description: 'No hay conexión con el servidor.',
			});
		}
	}, []);

	const sendPing = useCallback((payload: unknown) => {
		if (socketRef.current && socketRef.current.connected) {
			socketRef.current.timeout(5000).emit(submittedEventServer.SEND_PING, payload, (error, response) => {
				if (error) {
					console.error('[WebSocket] Error al enviar el PING:', error);
					toast.error('Error al enviar el PING');
				} else {
					console.log('[WebSocket] Respuesta al PING:', response);
					toast.success('PING enviado con éxito');
				}
			});
		} else {
			console.warn('[WebSocket] No se pudo enviar el PING, el socket no está conectado.');
			toast.warning('No se pudo realizar la acción', {
				description: 'No hay conexión con el servidor.',
			});
		}
	}, []);

	// ============ REFRESH MANUAL ============

	const refresh = useCallback(() => {
		fetchDevices();
	}, [fetchDevices]);

	// ============ RETURN ============

	return {
		devices,
		isConnected,
		isRefreshing,
		refresh,
		sendMessage,
		sendPing,
	};
}

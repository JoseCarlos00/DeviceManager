import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type { Socket } from 'socket.io-client';
import { apiClient } from '@/lib/api';
import type { Device } from '@/types';
import { setupSocket, cleanupSocket } from './socketSetup';

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
	};
}

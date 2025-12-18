import type { Socket } from 'socket.io-client';
import { submittedEventServer as SocketEvent } from '@/lib/constants';
import type {
	ClientToServerEvents,
	SendMessagePayload,
	SendDeviceIdPayload,
	Callback,
	MaintenanceModePayload,
	SendAllMessagePayload,
	AlarmActivationPayload,
} from '@/types/websocket';

export const createSocketEmitters = (socketRef: React.RefObject<Socket | null>) => {
	const emit = <E extends keyof ClientToServerEvents>(event: E, ...args: Parameters<ClientToServerEvents[E]>) => {
		if (socketRef.current?.connected) {
			socketRef.current.emit(event, ...args);
		} else {
			console.warn(`[WebSocket] No conectado, no se puede emitir: ${event}`);

			const callback = args[args.length - 1];
			if (typeof callback === 'function') {
				callback(null);
			}
		}
	};

	const sendMessage = (payload: SendMessagePayload, callback: Callback) => {
		emit(SocketEvent.SEND_MESSAGE, payload, callback);
	};

	const sendPing = (payload: SendDeviceIdPayload, callback: Callback) => {
		emit(SocketEvent.SEND_PING, payload, callback);
	};

	const getDeviceInfo = (payload: SendDeviceIdPayload, callback: Callback) => {
		emit(SocketEvent.GET_DEVICE_INFO, payload, callback);
	};

	const checkForUpdate = (payload: SendDeviceIdPayload, callback: Callback) => {
		emit(SocketEvent.CHECK_FOR_UPDATE, payload, callback);
	};

  const alarmActivate = (payload: AlarmActivationPayload, callback: Callback) => {
    emit(SocketEvent.ALARM_ACTIVATE, payload, callback);
  };

  const sendBroadcastMessage = (payload: SendAllMessagePayload, callback: Callback) => {
    emit(SocketEvent.SEND_BROADCAST_MESSAGE, payload, callback);
  };


  const setBroadcastMaintenanceMode = (payload: MaintenanceModePayload, callback: Callback) => {
    emit(SocketEvent.SET_BROADCAST_MAINTENANCE_MODE, payload, callback);
  };

  const checkForUpdateBroadcast = (callback: Callback) => {
    emit(SocketEvent.CHECK_FOR_UPDATE_BROADCAST, callback);
  };


	return {
		emit,
		sendMessage,
		sendPing,
		getDeviceInfo,
		checkForUpdate,
    alarmActivate,
    sendBroadcastMessage,
    setBroadcastMaintenanceMode,
    checkForUpdateBroadcast
	};
};

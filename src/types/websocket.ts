import { submittedEventServer } from "@/lib/constants";

export type ClientType = 'WEB_CLIENT';

export interface DeviceStatusEvent {
	deviceId: string;
	battery?: number;
	charging?: boolean;
	timestamp: number;
	lastSeen?: number;
}

export interface SocketConfig {
	withCredentials: boolean;
	transports: string[];
	reconnection: boolean;
	reconnectionDelay: number;
	reconnectionAttempts: number;
	query: {
		clientType: ClientType;
	};
}

export interface CallbackResponse {
	status: 'OK' | 'ERROR' | 'WARN' | 'FORBIDDEN' | 'UNAUTHORIZED';
	message: string;
	data?: Record<string, unknown>;
}


export type Callback = (response: CallbackResponse | null) => void;

export interface SendDeviceIdPayload {
	target_device_id: string;
}

export interface IdentifyClientPayload {
	clientType: ClientType;
}

export interface AlarmPayload {
	durationSeconds?: number; // default 10
	deviceAlias?: string; // default "desconocido"
}

export interface MessagePayload {
	message: string;
	sender?: string;
}

export type AlarmActivationPayload = SendDeviceIdPayload & AlarmPayload;
export type SendMessagePayload = SendDeviceIdPayload & { dataMessage: MessagePayload };
export type SendAllMessagePayload = { dataMessage: MessagePayload };


export interface MaintenanceModePayload {
	untilTimestampMs: number; // Timestamp cuando terminará el mantenimiento
	untilDateReadable?: string; // Fecha en formato legible
}


export interface ClientToServerEvents {
	[submittedEventServer.SEND_MESSAGE]: (payload: SendMessagePayload, callback: Callback) => void;

	[submittedEventServer.SEND_PING]: (payload: SendDeviceIdPayload, callback: Callback) => void;
	[submittedEventServer.GET_DEVICE_INFO]: (payload: SendDeviceIdPayload, callback: Callback) => void;
	[submittedEventServer.CHECK_FOR_UPDATE]: (payload: SendDeviceIdPayload, callback: Callback) => void;

	[submittedEventServer.ALARM_ACTIVATE]: (payload: AlarmActivationPayload, callback: Callback) => void;


	[submittedEventServer.SEND_BROADCAST_MESSAGE]: (payload: SendAllMessagePayload, callback: Callback) => void;
	[submittedEventServer.SET_BROADCAST_MAINTENANCE_MODE]: (payload: MaintenanceModePayload, callback: Callback) => void;
	[submittedEventServer.CHECK_FOR_UPDATE_BROADCAST]: (callback: Callback) => void;
}

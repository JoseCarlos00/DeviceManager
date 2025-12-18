import { submittedEventServer } from "@/lib/constants";

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
		clientType: string;
	};
}

export interface CallbackResponse {
	status: 'OK' | 'ERROR' | 'WARN' | 'FORBIDDEN' | 'UNAUTHORIZED';
	message: string;
	data?: Record<string, unknown>;
}


export type Callback = (response: CallbackResponse | null) => void;

export interface SendMessagePayload {
	target_device_id: string; // ID del dispositivo Android
	dataMessage: {
		message: string;
		sender?: string; // default "Nuevo Mensaje"
	};
}

export interface SendDeviceIdPayload {
	target_device_id: string;
}


export interface ClientToServerEvents {
	[submittedEventServer.SEND_MESSAGE]: (payload: SendMessagePayload, callback: Callback) => void;
	[submittedEventServer.SEND_PING]: (payload: SendDeviceIdPayload, callback: Callback) => void;
}


// // Eventos que recibimos
// export interface ServerToClientEvents {
//   [SocketEvent.DEVICE_CONNECTED]: (data: DeviceStatusEvent) => void;
//   [SocketEvent.DEVICE_DISCONNECTED]: (data: DeviceStatusEvent) => void;
//   [SocketEvent.DATA_MODIFIED]: (data: any) => void;
// }

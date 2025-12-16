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

export interface SendPingPayload {
	target_device_id: string;
}

export interface EventSubmittedHandlers {
	[submittedEventServer.SEND_MESSAGE]: (payload: SendMessagePayload, callback: Callback) => void;
	[submittedEventServer.SEND_PING]: (payload: SendPingPayload, callback: Callback) => void;
}

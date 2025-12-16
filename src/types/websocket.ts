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

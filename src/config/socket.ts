import type { SocketConfig } from '@/types/websocket';

export const SOCKET_CONFIG: SocketConfig = {
	withCredentials: true,
	transports: ['websocket', 'polling'],
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionAttempts: 5,
	query: {
		clientType: 'WEB_CLIENT',
	},
};

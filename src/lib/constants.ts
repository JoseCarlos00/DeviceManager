export const API_URL_AUTH = '/api/auth' as const;

export const receivedEventServer = {
	DATA_MODIFIED: 'data:modified',
	DEVICE_HEARTBEAT: 'DEVICE_HEARTBEAT',
	DEVICE_CONNECTED: 'device:connected', // Nuevo dispositivo conectado
	DEVICE_DISCONNECTED: 'device:disconnected', // Dispositivo desconectado
	DEVICE_RECONNECTED: 'device:reconnected', // Dispositivo volvió online
	DEVICE_BATTERY_UPDATE: 'device:battery:update', // Cambio de batería >= 5%
} as const;

export const submittedEventServer = {
	IDENTIFY_CLIENT: 'IDENTIFY_CLIENT',
	SEND_PING: 'SEND_PING',
	ALARM_ACTIVATE: 'ALARM_ACTIVATE',
	SEND_MESSAGE: 'SEND_MESSAGE',
	SEND_BROADCAST_MESSAGE: 'SEND_BROADCAST_MESSAGE',
	CHECK_FOR_UPDATE: 'CHECK_FOR_UPDATE',
	CHECK_FOR_UPDATE_BROADCAST: 'CHECK_FOR_ALL_UPDATE',
	GET_DEVICE_INFO: 'GET_DEVICE_INFO',
	SET_BROADCAST_MAINTENANCE_MODE: 'SET_MAINTENANCE_MODE',

	SET_SETTINGS: 'SET_SETTINGS', // *TODO: PENDIENTE DE IMPLEMENTAR EN LA APP*
} as const;

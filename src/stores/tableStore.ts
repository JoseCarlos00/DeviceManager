import { create } from 'zustand';

type AlarmUIState = 'idle' | 'sending' | 'active' | 'error';

interface AlarmUI {
	state: AlarmUIState;
	duration: number;
	startedAt?: number;
}


interface DeviceUIStore {
	// --- Mensajes ---
	messageRowId: string | null;
	messageText: string;

	setMessageRowId: (id: string | null) => void;
	setMessageText: (text: string) => void;
	resetMessage: () => void;

	// --- Alarmas ---
	alarms: Record<string, AlarmUI>;

	setAlarmSending: (deviceId: string, duration: number) => void;
	setAlarmActive: (deviceId: string) => void;
	setAlarmError: (deviceId: string) => void;
	clearAlarm: (deviceId: string) => void;
}

export const useDeviceUIStore = create<DeviceUIStore>((set) => ({
	// ----- Mensajes -----
	messageRowId: null,
	messageText: '',

	setMessageRowId: (id) => set({ messageRowId: id }),
	setMessageText: (text) => set({ messageText: text }),
	resetMessage: () => set({ messageRowId: null, messageText: '' }),

	// ----- Alarmas -----
	alarms: {},

	setAlarmSending: (deviceId, duration) =>
		set((state) => ({
			alarms: {
				...state.alarms,
				[deviceId]: {
					state: 'sending',
					duration,
				},
			},
		})),

	setAlarmActive: (deviceId) =>
		set((state) => ({
			alarms: {
				...state.alarms,
				[deviceId]: {
					...state.alarms[deviceId],
					state: 'active',
					startedAt: Date.now(),
				},
			},
		})),

	setAlarmError: (deviceId) =>
		set((state) => ({
			alarms: {
				...state.alarms,
				[deviceId]: {
					...state.alarms[deviceId],
					state: 'error',
				},
			},
		})),

	clearAlarm: (deviceId) =>
		set((state) => {
			const { [deviceId]: _, ...rest } = state.alarms;
			return { alarms: rest };
		}),
}));

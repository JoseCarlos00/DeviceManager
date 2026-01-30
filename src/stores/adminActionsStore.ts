import { create } from 'zustand';
import type { CallbackResponse } from '@/types';

export type AdminActionType = 'broadcast_message' | 'maintenance_mode' | 'update_notification';
export type AdminActionStatus = 'success' | 'partial' | 'error';

export interface AdminAction {
	id: string;
	timestamp: number;
	action: AdminActionType;
	executedBy: string;
	devicesAffected: number;
	totalDevices: number;
	status: AdminActionStatus;
	details: {
		message?: string;
		sender?: string;
		maintenanceUntil?: number;
		maintenanceUntilReadable?: string;
		reason?: string;
		offlineDevices?: number;
		serverResponse?: CallbackResponse;
	};
}

interface AdminActionsStore {
	actions: AdminAction[];
	addAction: (action: Omit<AdminAction, 'id' | 'timestamp'>) => void;
	clearActions: () => void;
}

export const useAdminActionsStore = create<AdminActionsStore>((set) => ({
	actions: [],

	addAction: (action) => {
		const newAction: AdminAction = {
			...action,
			id: Date.now().toString(),
			timestamp: Date.now(),
		};

		set((state) => ({
			actions: [newAction, ...state.actions].slice(0, 100), // Últimas 100 acciones
		}));
	},

	clearActions: () => set({ actions: [] }),
}));

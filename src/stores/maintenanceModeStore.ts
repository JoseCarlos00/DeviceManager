import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MaintenanceModeData {
	untilTimestampMs: number;
	untilDateReadable: string;
}

interface MaintenanceModeState {
	isMaintenanceMode: boolean;
	data: MaintenanceModeData | null;

	setMaintenanceMode: (data: MaintenanceModeData) => void;
	clearMaintenanceMode: () => void;
	checkAndClearExpired: () => void;
}

let maintenanceTimeout: ReturnType<typeof setTimeout> | null = null;

export const useMaintenanceModeStore = create<MaintenanceModeState>()(
	persist(
		(set, get) => ({
			isMaintenanceMode: false,
			data: null,

			setMaintenanceMode: ({ untilTimestampMs, untilDateReadable }) => {
				// Limpiar timeout anterior si existe
				if (maintenanceTimeout) {
					clearTimeout(maintenanceTimeout);
					maintenanceTimeout = null;
				}

				const now = Date.now();
				const delay = untilTimestampMs - now;

				// Solo programar el timeout si la fecha es futura
				if (delay > 0) {
					// Máximo delay permitido por setTimeout es ~24.8 días (2^31-1 ms)
					const MAX_TIMEOUT = 2147483647;
					const actualDelay = Math.min(delay, MAX_TIMEOUT);

					maintenanceTimeout = setTimeout(() => {
						console.log('⏰ Maintenance mode expired, clearing...');
						get().clearMaintenanceMode();
					}, actualDelay);

					console.log(`✅ Timeout programado para ${(actualDelay / 1000 / 60).toFixed(2)} minutos`);
				} else {
					console.warn('⚠️ La fecha ya pasó, no se activa el modo mantenimiento');
					return; // No activar si la fecha ya pasó
				}

				set({
					isMaintenanceMode: true,
					data: { untilTimestampMs, untilDateReadable },
				});
			},

			clearMaintenanceMode: () => {
				console.log('🧹 Clearing maintenance mode...');

				if (maintenanceTimeout) {
					clearTimeout(maintenanceTimeout);
					maintenanceTimeout = null;
				}

				set({ isMaintenanceMode: false, data: null });
			},

			// Función para verificar si expiró (útil al recargar la página)
			checkAndClearExpired: () => {
				const state = get();
				if (state.isMaintenanceMode && state.data) {
					const now = Date.now();

					if (now >= state.data.untilTimestampMs) {
						console.log('🔍 Maintenance mode already expired on check');
						state.clearMaintenanceMode();
					} else {
						// Re-programar el timeout si la app se recargó
						const delay = state.data.untilTimestampMs - now;
						console.log(`🔄 Re-scheduling timeout for ${(delay / 1000 / 60).toFixed(2)} minutes`);
						state.setMaintenanceMode(state.data);
					}
				}
			},
		}),
		{
			name: 'maintenance-mode-storage', // Nombre para localStorage
			// Solo persistir estos campos
			partialize: (state) => ({
				isMaintenanceMode: state.isMaintenanceMode,
				data: state.data,
			}),
		},
	),
);

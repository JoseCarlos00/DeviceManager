import { useEffect } from 'react';
import { useMaintenanceModeStore } from '@/stores/useMaintenanceModeStore';

export function MaintenanceModeWatcher() {
	const checkAndClearExpired = useMaintenanceModeStore((state) => state.checkAndClearExpired);

	useEffect(() => {
		checkAndClearExpired();
	}, [checkAndClearExpired]);

	return null;
}

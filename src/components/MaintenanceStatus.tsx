import { Wrench, Clock } from 'lucide-react';
import { useMaintenanceModeStore } from "@/stores/useMaintenanceModeStore";
import { useMaintenanceCountdown } from '@/hooks/useMaintenanceCountdown';
import { Badge } from '@/components/ui/badge';

export function MaintenanceStatus() {
	const isMaintenanceMode = useMaintenanceModeStore((state) => state.isMaintenanceMode);
	const maintenanceData = useMaintenanceModeStore((state) => state.data);
	const { formatted } = useMaintenanceCountdown();

	if (!isMaintenanceMode) {
		return (
			<div className='space-y-1'>
				<div className='flex items-center gap-2 text-muted-foreground text-sm'>
					<Wrench className='h-4 w-4' />
					En mantenimiento
				</div>
				<Badge variant='outline'>Inactivo</Badge>
			</div>
		);
	}

	return (
		<div className='space-y-1'>
			<div className='flex items-center gap-2 text-muted-foreground text-sm'>
				<Wrench className='h-4 w-4' />
				En mantenimiento
			</div>
			<div className='flex items-center gap-2'>
				<Badge variant='destructive'>Activo</Badge>
			</div>

			{isMaintenanceMode && maintenanceData && (
				<div className='mt-2 space-y-1'>
					<div className='flex items-center gap-2 text-xs text-muted-foreground'>
						<Clock className='h-3 w-3' />
						Tiempo restante:
					</div>
					<p className='text-sm font-mono font-semibold text-destructive'>{formatted}</p>
					<p className='text-xs text-muted-foreground'>Finaliza: {maintenanceData.untilDateReadable}</p>
				</div>
			)}
		</div>
	);
}

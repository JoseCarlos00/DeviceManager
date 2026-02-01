// pages/Administration.tsx
import { Shield } from 'lucide-react';
import { useDeviceWebSocket } from '@/hooks/useDeviceWebSocket';
import { useAdminActionsStore } from '@/stores/adminActionsStore';
import AdminStatsCard from '@/components/administration/AdminStatsCard';
import BroadcastMessageCard from '@/components/administration/BroadcastMessageCard';
import MaintenanceModeCard from '@/components/administration/MaintenanceModeCard';
import UpdateNotificationCard from '@/components/administration/UpdateNotificationCard';
import AdminActionsTable from '@/components/administration/AdminActionsTable';

export default function Administration() {
	const { devices } = useDeviceWebSocket();
	const actions = useAdminActionsStore((state) => state.actions);

	const connectedDevices = devices.filter((d) => d.online).length;
	const totalDevices = devices.length;
	const maintenanceDevices = 0; // TODO: Implementar lógica de mantenimiento

	const lastAction = actions[0]
		? `${actions[0].action === 'broadcast_message' ? 'Mensaje' : actions[0].action === 'maintenance_mode' ? 'Mantenimiento' : 'Actualización'} - ${new Date(actions[0].timestamp).toLocaleTimeString()}`
		: undefined;

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center gap-3'>
				<Shield className='h-8 w-8 text-primary' />
				<div>
					<h1 className='text-3xl font-bold'>Administración</h1>
					<p className='text-muted-foreground'>Acciones que afectan a todos los dispositivos</p>
				</div>
			</div>

			{/* Estadísticas */}
			<AdminStatsCard
				connectedDevices={connectedDevices}
				totalDevices={totalDevices}
				maintenanceDevices={maintenanceDevices}
				lastAction={lastAction}
			/>

			{/* Cards de acciones */}
			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
				<BroadcastMessageCard connectedDevices={connectedDevices} />
				<MaintenanceModeCard totalDevices={totalDevices} />
				<UpdateNotificationCard
					connectedDevices={connectedDevices}
					totalDevices={totalDevices}
				/>
			</div>

			{/* Historial */}
			<AdminActionsTable />
		</div>
	);
}

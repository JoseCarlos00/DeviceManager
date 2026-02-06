import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import BroadcastMessageCard from '@/components/administration/BroadcastMessageCard';
import MaintenanceModeCard from '@/components/administration/MaintenanceModeCard';
import UpdateNotificationCard from '@/components/administration/UpdateNotificationCard';
import AdminActionsTable from '@/components/administration/AdminActionsTable';
import StatusConnection from '@/components/StatusConnection'

export default function Administration() {
	const { devices } = useDeviceActions();

	const connectedDevices = devices.filter((d) => d.online).length;
	const totalDevices = devices.length;
	const maintenanceDevices = 0; // TODO: Implementar lógica de mantenimiento


	return (
		<div className='space-y-6 pt-2'>
			{/* Estadísticas */}
			<StatusConnection
				connectedDevices={connectedDevices}
				totalDevices={totalDevices}
				maintenanceDevices={maintenanceDevices}
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

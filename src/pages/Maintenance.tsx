import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import MaintenanceModeCard from '@/components/administration/MaintenanceModeCard';
import UpdateNotificationCard from '@/components/administration/UpdateNotificationCard';
import AdminActionsTable from '@/components/administration/AdminActionsTable';
import StatusConnection from '@/components/StatusConnection';

export default function Maintenance() {
	const { devices } = useDeviceActions();
	const connectedDevices = devices.filter((d) => d.online).length;
	const totalDevices = devices.length;

	return (
		<div className='space-y-6 pt-2'>
			<StatusConnection
				connectedDevices={connectedDevices}
				totalDevices={totalDevices}
			/>

			<div className='grid gap-6 md:grid-cols-2'>
				<MaintenanceModeCard totalDevices={totalDevices} />
				<UpdateNotificationCard
					connectedDevices={connectedDevices}
					totalDevices={totalDevices}
				/>
			</div>

			<AdminActionsTable filter={['maintenance_mode', 'update_notification']} />
		</div>
	);
}

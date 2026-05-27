import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import BroadcastMessageCard from '@/components/administration/BroadcastMessageCard';
import AdminActionsTable from '@/components/administration/AdminActionsTable';
import StatusConnection from '@/components/StatusConnection';

export default function Broadcast() {
	const { devices } = useDeviceActions();
	const connectedDevices = devices.filter((d) => d.online).length;
	const totalDevices = devices.length;

	return (
		<div className='space-y-6 pt-2'>
			<StatusConnection
				connectedDevices={connectedDevices}
				totalDevices={totalDevices}
			/>

			<BroadcastMessageCard connectedDevices={connectedDevices} />

			<AdminActionsTable filter={['broadcast_message']} />
		</div>
	);
}

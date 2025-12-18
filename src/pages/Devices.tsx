import TableContent from '@/components/devices/TableContent';
import { DeviceActionsProvider } from '@/contexts/DeviceActionsContext';
import { useDeviceWebSocket } from '@/hooks/useDeviceWebSocket'

export default function Devices() {

	const { isConnected, sendMessage, sendPing, alarmActivate } = useDeviceWebSocket();

		const actionsValue = {
			isConnected,
			SEND_MESSAGE: sendMessage,
			SEND_PING: sendPing,
			ALARM_ACTIVATE: alarmActivate,
		};

	return <DeviceActionsProvider value={actionsValue}>
		<TableContent />
	</DeviceActionsProvider>;
}

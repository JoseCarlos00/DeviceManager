import { useDeviceActions } from '@/contexts/DeviceActionsContext'

function ConnectionIndicator() {
	const { isConnected } = useDeviceActions();

  return (
		<div className='flex items-center gap-2 text-sm'>
			<div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
			<span className='text-muted-foreground'>{isConnected ? 'Online' : 'Offline'}</span>
		</div>
	);
}

export default ConnectionIndicator

import { Card, CardContent } from '@/components/ui/card';
import { Activity, Wifi, Wrench } from 'lucide-react';
import ConnectionIndicator from './ConnectionIndicator'

interface StatusConnectionProps {
	connectedDevices: number;
	totalDevices: number;
	maintenanceDevices: number;
}

 export default function StatusConnection({
	connectedDevices,
	totalDevices,
	maintenanceDevices,
}: StatusConnectionProps) {
	return (
		<Card className='relative'>

			<div className='absolute top-1 left-2 flex items-center gap-2'>
				<Activity className='h-4 w-4' />
				<ConnectionIndicator />
			</div>

			<CardContent>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-5'>
					<div className='space-y-1'>
						<div className='flex items-center gap-2 text-muted-foreground text-sm'>
							<Wifi className='h-4 w-4' />
							Conectados
						</div>
						<p className='text-2xl font-bold'>
							{connectedDevices}
							<span className='text-lg text-muted-foreground'>/{totalDevices}</span>
						</p>
					</div>

					<div className='space-y-1'>
						<div className='flex items-center gap-2 text-muted-foreground text-sm'>
							<Wrench className='h-4 w-4' />
							En mantenimiento
						</div>
						<p className='text-2xl font-bold'>{maintenanceDevices}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

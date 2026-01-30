// components/administration/AdminStatsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Wifi, Wrench, Clock } from 'lucide-react';

interface AdminStatsCardProps {
	connectedDevices: number;
	totalDevices: number;
	maintenanceDevices: number;
	lastAction?: string;
}

export default function AdminStatsCard({
	connectedDevices,
	totalDevices,
	maintenanceDevices,
	lastAction,
}: AdminStatsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg flex items-center gap-2'>
					<Activity className='h-5 w-5' />
					Estadísticas Generales
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
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

					<div className='col-span-2 space-y-1'>
						<div className='flex items-center gap-2 text-muted-foreground text-sm'>
							<Clock className='h-4 w-4' />
							Última acción
						</div>
						<p className='text-sm font-medium truncate'>{lastAction || 'Sin acciones recientes'}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

import { useState } from 'react';
import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import MaintenanceModeCard from '@/components/administration/MaintenanceModeCard';
import UpdateNotificationCard from '@/components/administration/UpdateNotificationCard';
import StatusConnection from '@/components/StatusConnection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wrench, RefreshCw, Eye, History } from 'lucide-react';
import { useAdminActionsStore, type AdminAction } from '@/stores/adminActionsStore';
import ActionDetailsDialog from '@/components/administration/ActionDetailsDialog';

const ACTION_ICONS = {
	maintenance_mode: Wrench,
	update_notification: RefreshCw,
} as const;

const ACTION_LABELS = {
	maintenance_mode: 'Modo Mantenimiento',
	update_notification: 'Notificación de Actualización',
} as const;

export default function MaintenancePage() {
	const { devices } = useDeviceActions();
	const connectedDevices = devices.filter((d) => d.online).length;
	const totalDevices = devices.length;

	const actions = useAdminActionsStore((state) =>
		state.actions.filter(
			(a) => a.action === 'maintenance_mode' || a.action === 'update_notification'
		)
	);

	const [selectedAction, setSelectedAction] = useState<AdminAction | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<div className='space-y-6 pt-2'>
			<StatusConnection connectedDevices={connectedDevices} totalDevices={totalDevices} />

			<div className='grid gap-6 md:grid-cols-2'>
				<MaintenanceModeCard totalDevices={totalDevices} />
				<UpdateNotificationCard
					connectedDevices={connectedDevices}
					totalDevices={totalDevices}
				/>
			</div>

			{/* Historial filtrado */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<History className='h-5 w-5' />
						Historial de mantenimiento
					</CardTitle>
				</CardHeader>
				<CardContent>
					{actions.length === 0 ? (
						<p className='text-center text-sm text-muted-foreground py-8'>
							No hay acciones registradas en esta sesión.
						</p>
					) : (
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Fecha y Hora</TableHead>
										<TableHead>Acción</TableHead>
										<TableHead>Ejecutado por</TableHead>
										<TableHead>Dispositivos</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead className='text-right'>Detalles</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{actions.map((action) => {
										const Icon = ACTION_ICONS[action.action as keyof typeof ACTION_ICONS];
										const label = ACTION_LABELS[action.action as keyof typeof ACTION_LABELS];
										return (
											<TableRow key={action.id}>
												<TableCell className='font-mono text-xs'>
													{new Date(action.timestamp).toLocaleString()}
												</TableCell>
												<TableCell>
													<div className='flex items-center gap-2'>
														<Icon className='h-4 w-4 text-muted-foreground' />
														<span className='text-sm'>{label}</span>
													</div>
												</TableCell>
												<TableCell className='text-sm'>{action.executedBy}</TableCell>
												<TableCell className='text-sm font-medium'>
													{action.devicesAffected}/{action.totalDevices}
												</TableCell>
												<TableCell>
													<Badge variant={action.status === 'success' ? 'default' : action.status === 'partial' ? 'secondary' : 'destructive'}>
														{action.status === 'success' && '✅ Exitoso'}
														{action.status === 'partial' && '⚠️ Parcial'}
														{action.status === 'error' && '❌ Error'}
													</Badge>
												</TableCell>
												<TableCell className='text-right'>
													<Button
														variant='ghost'
														size='sm'
														className='cursor-pointer'
														onClick={() => { setSelectedAction(action); setDialogOpen(true); }}
													>
														<Eye className='h-4 w-4' />
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<ActionDetailsDialog action={selectedAction} open={dialogOpen} onOpenChange={setDialogOpen} />
		</div>
	);
}

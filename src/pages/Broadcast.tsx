import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import BroadcastMessageCard from '@/components/administration/BroadcastMessageCard';
import StatusConnection from '@/components/StatusConnection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, Eye, History } from 'lucide-react';
import { useState } from 'react';
import { useAdminActionsStore, type AdminAction } from '@/stores/adminActionsStore';
import ActionDetailsDialog from '@/components/administration/ActionDetailsDialog';

export default function BroadcastPage() {
	const { devices } = useDeviceActions();
	const connectedDevices = devices.filter((d) => d.online).length;
	const totalDevices = devices.length;

	const actions = useAdminActionsStore((state) =>
		state.actions.filter((a) => a.action === 'broadcast_message')
	);

	const [selectedAction, setSelectedAction] = useState<AdminAction | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<div className='space-y-6 pt-2'>
			<StatusConnection connectedDevices={connectedDevices} totalDevices={totalDevices} />

			<BroadcastMessageCard connectedDevices={connectedDevices} />

			{/* Historial filtrado */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<History className='h-5 w-5' />
						Historial de mensajes
					</CardTitle>
				</CardHeader>
				<CardContent>
					{actions.length === 0 ? (
						<p className='text-center text-sm text-muted-foreground py-8'>
							No hay mensajes enviados en esta sesión.
						</p>
					) : (
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Fecha y Hora</TableHead>
										<TableHead>Mensaje</TableHead>
										<TableHead>Remitente</TableHead>
										<TableHead>Dispositivos</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead className='text-right'>Detalles</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{actions.map((action) => (
										<TableRow key={action.id}>
											<TableCell className='font-mono text-xs'>
												{new Date(action.timestamp).toLocaleString()}
											</TableCell>
											<TableCell className='max-w-48'>
												<p className='text-sm truncate italic'>"{action.details.message}"</p>
											</TableCell>
											<TableCell className='text-sm'>{action.details.sender}</TableCell>
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
									))}
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

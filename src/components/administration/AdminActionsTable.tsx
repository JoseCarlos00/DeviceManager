// components/administration/AdminActionsTable.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, Wrench, RefreshCw, Eye, History } from 'lucide-react';
import { useAdminActionsStore, type AdminAction } from '@/stores/adminActionsStore';
import ActionDetailsDialog from './ActionDetailsDialog';

const ACTION_ICONS = {
	broadcast_message: MessageSquare,
	maintenance_mode: Wrench,
	update_notification: RefreshCw,
};

const ACTION_LABELS = {
	broadcast_message: 'Mensaje Broadcast',
	maintenance_mode: 'Modo Mantenimiento',
	update_notification: 'Notificación de Actualización',
};

export default function AdminActionsTable() {
	const actions = useAdminActionsStore((state) => state.actions);
	const [selectedAction, setSelectedAction] = useState<AdminAction | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleViewDetails = (action: AdminAction) => {
		setSelectedAction(action);
		setDialogOpen(true);
	};

	if (actions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<History className='h-5 w-5' />
						Historial de Acciones
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-center text-sm text-muted-foreground py-8'>No hay acciones registradas</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<History className='h-5 w-5' />
						Historial de Acciones
					</CardTitle>
				</CardHeader>
				<CardContent>
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
									const Icon = ACTION_ICONS[action.action];
									return (
										<TableRow key={action.id}>
											<TableCell className='font-mono text-xs'>{new Date(action.timestamp).toLocaleString()}</TableCell>
											<TableCell>
												<div className='flex items-center gap-2'>
													<Icon className='h-4 w-4 text-muted-foreground' />
													<span className='text-sm'>{ACTION_LABELS[action.action]}</span>
												</div>
											</TableCell>
											<TableCell className='text-sm'>{action.executedBy}</TableCell>
											<TableCell>
												<span className='text-sm font-medium'>
													{action.devicesAffected}/{action.totalDevices}
												</span>
											</TableCell>
											<TableCell>
												<Badge
													variant={
														action.status === 'success'
															? 'default'
															: action.status === 'partial'
																? 'secondary'
																: 'destructive'
													}
												>
													{action.status === 'success' && '✅ Exitoso'}
													{action.status === 'partial' && '⚠️ Parcial'}
													{action.status === 'error' && '❌ Error'}
												</Badge>
											</TableCell>
											<TableCell className='text-right'>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => handleViewDetails(action)}
													className='cursor-pointer'
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
				</CardContent>
			</Card>

			<ActionDetailsDialog
				action={selectedAction}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			/>
		</>
	);
}

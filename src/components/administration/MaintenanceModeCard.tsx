import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Wrench, Calendar, Clock } from 'lucide-react';
import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import { useResponseHandler } from '@/hooks/useResponseHandler';
import { useAdminActionsStore } from '@/stores/adminActionsStore';
import { useAuthStore } from '@/stores/authStore';
import { useMaintenanceModeStore } from '@/stores/useMaintenanceModeStore';

interface MaintenanceModeCardProps {
	totalDevices: number;
}

export default function MaintenanceModeCard({ totalDevices }: MaintenanceModeCardProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isSending, setIsSending] = useState(false);
	
	// Opciones: 'duration' para horas, 'datetime' para fecha/hora específica
	const [selectionMode, setSelectionMode] = useState<'duration' | 'datetime'>('datetime');
	
	// Para modo duración
	const [durationHours, setDurationHours] = useState<number>(2);
	
	// Para modo fecha/hora
	const [selectedDate, setSelectedDate] = useState<string>(() => {
		const date = new Date();
		date.setHours(date.getHours() - 4);
		return date.toISOString().slice(0, 16); // formato: "YYYY-MM-DDTHH:mm"
	});

	const { SET_MAINTENANCE_MODE: SET_BROADCAST_MAINTENANCE_MODE } = useDeviceActions();
	const { handleResponse } = useResponseHandler();
	const addAction = useAdminActionsStore((state) => state.addAction);
	const user = useAuthStore((state) => state.user);

	const setMaintenanceMode = useMaintenanceModeStore((state) => state.setMaintenanceMode);

	// Calcular untilTimestampMs basado en el modo seleccionado
	const getUntilTimestamp = (): number => {
		if (selectionMode === 'duration') {
			return Date.now() + durationHours * 60 * 60 * 1000;
		} else {
			return new Date(selectedDate).getTime();
		}
	};

	// Fecha calculada para mostrar
	const untilDate = new Date(getUntilTimestamp());

	// Validar que la fecha seleccionada sea futura
	const isValidDateTime = selectionMode === 'duration' || new Date(selectedDate).getTime() > Date.now();

	const handleActivateMaintenance = () => {
		setIsSending(true);

		const untilTimestampMs = getUntilTimestamp();
		const untilDateReadable = new Date(untilTimestampMs).toLocaleString();

		const payload = {
			untilTimestampMs,
			untilDateReadable,
		};

		setMaintenanceMode(payload);

		SET_BROADCAST_MAINTENANCE_MODE(payload, (response) => {
			handleResponse(response, {
				successMessage: `Modo mantenimiento activado hasta ${untilDateReadable}`,
				icon: <Wrench className='h-4 w-4' />,
				addToLog: false,
			});


			if (response?.status === 'OK') {
				addAction({
					action: 'maintenance_mode',
					executedBy: user?.username || 'Unknown',
					devicesAffected: totalDevices,
					totalDevices,
					status: 'success',
					details: {
						maintenanceUntil: untilTimestampMs,
						maintenanceUntilReadable: untilDateReadable,
						serverResponse: response,
					},
				});

				setDialogOpen(false);
			}

			setIsSending(false);
		});
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Wrench className='h-5 w-5' />
						Modo Mantenimiento
					</CardTitle>
					<CardDescription>Activa el modo mantenimiento en todos los dispositivos</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Selector de modo */}
					<div className='space-y-2'>
						<Label>Tipo de configuración</Label>
						<div className='flex gap-2'>
							<Button
								type='button'
								variant={selectionMode === 'duration' ? 'default' : 'outline'}
								onClick={() => setSelectionMode('duration')}
								className='flex-1 cursor-pointer'
							>
								<Clock className='h-4 w-4 mr-2' />
								Tiempo
							</Button>
							<Button
								type='button'
								variant={selectionMode === 'datetime' ? 'default' : 'outline'}
								onClick={() => setSelectionMode('datetime')}
								className='flex-1 cursor-pointer'
							>
								<Calendar className='h-4 w-4 mr-2' />
								Fecha/Hora
							</Button>
						</div>
					</div>

					{/* Modo Duración */}
					{selectionMode === 'duration' && (
						<div className='space-y-2'>
							<Label htmlFor='duration'>Duración (horas)</Label>
							<Input
								id='duration'
								type='number'
								min={1}
								max={72}
								value={durationHours}
								onChange={(e) => setDurationHours(Number(e.target.value))}
							/>
							<p className='text-xs text-muted-foreground'>Rango: 1 a 72 horas</p>
						</div>
					)}

					{/* Modo Fecha/Hora */}
					{selectionMode === 'datetime' && (
						<div className='space-y-2'>
							<Label htmlFor='datetime'>Fecha y hora de finalización</Label>
							<Input
								id='datetime'
								type='datetime-local'
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
								min={new Date().toISOString().slice(0, 16)}
								className='cursor-pointer'
							/>
							{!isValidDateTime && <p className='text-xs text-destructive'>⚠️ La fecha debe ser futura</p>}
						</div>
					)}

					{/* Resumen */}
					<div className='p-3 bg-muted rounded-md space-y-1'>
						<div className='flex items-center gap-2 text-sm'>
							<Calendar className='h-4 w-4' />
							<span className='font-medium'>El mantenimiento terminará:</span>
						</div>
						<p className='text-sm text-muted-foreground'>{untilDate.toLocaleString()}</p>
						<Badge
							variant='outline'
							className='mt-2'
						>
							{selectionMode === 'duration'
								? `En ${durationHours} ${durationHours === 1 ? 'hora' : 'horas'}`
								: `Hasta ${untilDate.toLocaleDateString()} a las ${untilDate.toLocaleTimeString()}`}
						</Badge>
					</div>

					<Button
						onClick={() => setDialogOpen(true)}
						disabled={totalDevices === 0 || !isValidDateTime}
						variant='destructive'
						className='w-full cursor-pointer'
					>
						<Wrench className='h-4 w-4 mr-2' />
						Activar Modo Mantenimiento
					</Button>

				</CardContent>
			</Card>

			<AlertDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>⚠️ ¿Activar modo mantenimiento en {totalDevices} dispositivos?</AlertDialogTitle>
						<AlertDialogDescription>
							Los dispositivos entrarán en modo mantenimiento y algunas funciones estarán restringidas.
							<div className='mt-4 p-3 bg-muted rounded-md space-y-2'>
								<p className='text-sm font-medium'>Detalles:</p>
								<ul className='text-sm space-y-1'>
									<li>• Finalizará: {untilDate.toLocaleString()}</li>
									<li>• Dispositivos afectados: {totalDevices}</li>
									{selectionMode === 'duration' && (
										<li>
											• Duración: {durationHours} {durationHours === 1 ? 'hora' : 'horas'}
										</li>
									)}
								</ul>
							</div>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							disabled={isSending}
							className='cursor-pointer'
						>
							Cancelar
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								handleActivateMaintenance();
							}}
							disabled={isSending}
							className='bg-destructive hover:bg-destructive/90 cursor-pointer'
						>
							{isSending ? 'Activando...' : 'Activar Mantenimiento'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

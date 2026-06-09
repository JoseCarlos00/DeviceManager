import { useState, type HTMLAttributes } from 'react';
import type { Row } from '@tanstack/react-table';
import { BellRing, Pen, MessageSquareText, SmartphoneNfc, MoreVertical } from 'lucide-react';
import type { Callback, Device } from '@/types';
import { useDeviceActions } from '@/contexts/DeviceActionsContext';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useDeviceUIStore } from '@/stores/tableStore';
import { useResponseHandler } from '@/hooks/useResponseHandler'

interface ActionsMenuProps<TValue> extends HTMLAttributes<HTMLDivElement> {
	row: Row<TValue>;
}

type AlarmUIState = 'idle' | 'sending' | 'active' | 'error';

export default function ActionsMenu<TValue>({ row }: ActionsMenuProps<TValue>) {
	const { SEND_PING, ALARM_ACTIVATE } = useDeviceActions();
	const setMessageRowId = useDeviceUIStore((state) => state.setMessageRowId);
	const setAlarmSending = useDeviceUIStore((state) => state.setAlarmSending);
	const setAlarmActive = useDeviceUIStore((state) => state.setAlarmActive);
	const setAlarmError = useDeviceUIStore((state) => state.setAlarmError);
	const clearAlarm = useDeviceUIStore((state) => state.clearAlarm);

	const { handleResponse } = useResponseHandler();
	const [alarmDialogOpen, setAlarmDialogOpen] = useState(false);

	const [alarmState, setAlarmState] = useState<AlarmUIState>('idle');
	const [duration, setDuration] = useState<number>(10);

	const currentUser = row.original as Device;
	const deviceId = currentUser.androidId;

	const alarm = useDeviceUIStore((state) => (deviceId ? state.alarms[deviceId] : undefined));

	const isDisabled = !currentUser.androidId || !currentUser.online;

	const handleAction = (action: 'ping' | 'alert' | 'message') => {
		if (!currentUser.androidId) return;

		const callback: Callback = (response) => {
			handleResponse(response)
		};

		if (action === 'ping') {
			const payload = {
				target_device_id: currentUser.androidId,
			};

			SEND_PING(payload, callback);
		}
		if (action === 'message') {
			setMessageRowId(row.id);
		}
	};

	const handleActivateAlarm = () => {
		if (!currentUser.androidId) return;

		setAlarmState('sending');
		setAlarmSending(deviceId!, duration);

		const payload = {
			target_device_id: currentUser.androidId,
			durationSeconds: duration,
			deviceAlias: currentUser.equipo,
		};

		setAlarmSending(deviceId!, duration);

		ALARM_ACTIVATE(payload, (response) => {
			handleResponse(response, {
				successMessage: `Alarma activada en ${currentUser.equipo}`,
				icon: <BellRing className='h-4 w-4' />,
			});

			if (response?.status === 'OK') {
				setAlarmActive(deviceId!);
				setAlarmState('active');
			} else {
				setAlarmError(deviceId!);
				setAlarmState('error');
			}
		});

		setTimeout(() => {
			clearAlarm(deviceId!);
		}, duration * 1000);
	};


	const handleCloseAlarmDialog = () => {
		resetAlarmUI();
		setAlarmDialogOpen(false);
	};

	const resetAlarmUI = () => {
		setAlarmState('idle');
	};

	return (
		<div
			className={`flex items-center gap-2 w-30 shrink-0 relative ${isDisabled ? 'opacity-45 pointer-events-none' : ''}`}
		>
			{/* Contenedor principal para alinear horizontalmente */}
			<div className='flex items-center gap-2'>
				{/* Ping */}
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className='cursor-pointer p-1 hover:bg-accent rounded-sm transition-colors'
							onClick={() => handleAction('ping')}
						>
							<SmartphoneNfc className='h-4 w-4' />
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>Enviar Ping</p>
					</TooltipContent>
				</Tooltip>

				{/* Alarm */}
				<div className='flex items-center'>
					{/* Contenedor para la campana y el icono de más opciones */}
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className='cursor-pointer p-1 hover:bg-accent rounded-sm transition-colors'
								onClick={() => handleActivateAlarm()}
							>
								<BellRing className='h-4 w-4' />
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Activar Alarma</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								role='button'
								className='cursor-pointer p-1 hover:bg-accent rounded-sm transition-colors'
								title='Configurar duración'
								onClick={(e) => {
									e.stopPropagation(); // Evita que el clic se propague al icono de campana
									setAlarmDialogOpen(true);
								}}
							>
								<MoreVertical className='h-4 w-4 text-muted-foreground hover:text-foreground' />
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Configurar Alarma</p>
						</TooltipContent>
					</Tooltip>
				</div>

				{/* Message */}
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className='cursor-pointer p-1 hover:bg-accent rounded-sm transition-colors'
							onClick={() => handleAction('message')}
						>
							<MessageSquareText className='h-4 w-4' />
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>Enviar Mensaje</p>
					</TooltipContent>
				</Tooltip>
			</div>

			<div className='absolute'>
				{alarm?.state === 'sending' && (
					<Badge
						variant='secondary'
						className='text-xs'
					>
						Enviando alarma…
					</Badge>
				)}
				{alarm?.state === 'active' && (
					<Badge className='bg-red-600 text-xs text-white'>
						<BellRing className='h-3 w-3 mr-1' />
						Alarma activa
					</Badge>
				)}
				{alarm?.state === 'error' && (
					<Badge
						variant='destructive'
						className='text-xs'
					>
						Error
					</Badge>
				)}
			</div>

			{/* Solo se abre si no se está enviando la alarma */}
			<AlertDialog
				open={alarmDialogOpen && alarmState !== 'sending'}
				onOpenChange={setAlarmDialogOpen}
			>
				<AlertDialogContent className='w-max'>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{alarmState === 'active' ? (
								<>
									Alarma activada
									<Tooltip>
										<TooltipTrigger>
											<Pen
												className='h-3 w-3 inline ml-2 cursor-pointer'
												onClick={() => resetAlarmUI()}
											/>
										</TooltipTrigger>
										<TooltipContent>
											<p>Editar alarma</p>
										</TooltipContent>
									</Tooltip>
								</>
							) : (
								`¿Activar alarma en ${currentUser.equipo}?`
							)}
						</AlertDialogTitle>

						<AlertDialogDescription>
							{alarmState === 'active' ? (
								<div className='flex items-center gap-2 text-green-600 font-medium'>
									<BellRing className='h-4 w-4 animate-pulse' />
									Alarma enviada correctamente ({duration}s)
								</div>
							) : (
								<>
									La alarma sonará y se desactivará automáticamente.
									<div className='py-4'>
										<Label className='mb-2'>Duración (10 segundos por defecto)</Label>
										<Input
											type='number'
											min={5}
											max={300}
											value={duration}
											onChange={(e) => setDuration(Number(e.target.value))}
											disabled={alarmState === 'sending'}
										/>
										<p className='text-xs text-muted-foreground mt-1'>Rango permitido: 5 a 300 segundos</p>
									</div>
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={handleCloseAlarmDialog}
							className='cursor-pointer'
						>
							Cerrar
						</AlertDialogCancel>

						<AlertDialogAction
							onClick={
								alarmState === 'active' || alarmState === 'error' || alarmState === 'idle'
									? (e) => {
											e.preventDefault();
											handleActivateAlarm();
										}
									: undefined
							}
							className={
								alarmState === 'active'
									? 'bg-green-600 hover:bg-green-700 cursor-pointer'
									: 'bg-destructive cursor-pointer'
							}
						>
							{alarmState === 'sending' && 'Enviando...'}
							{alarmState === 'idle' && 'Activar alarma'}
							{alarmState === 'active' && 'Enviar otra alarma'}
							{alarmState === 'error' && 'Reintentar'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

import { useState, type HTMLAttributes } from 'react';
import type { Row } from '@tanstack/react-table';
import { MoreHorizontal, Bell, Pen } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Device } from '@/types';
import type { Callback } from '@/types';
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

interface ActionsMenuProps<TValue> extends HTMLAttributes<HTMLDivElement> {
	row: Row<TValue>;
}

type AlarmUIState = 'idle' | 'sending' | 'active' | 'error';

export default function ActionsMenu<TValue>({ row }: ActionsMenuProps<TValue>) {
	const { isConnected, SEND_PING } = useDeviceActions();
	const setMessageRowId = useDeviceUIStore((state) => state.setMessageRowId);
	const setAlarmSending = useDeviceUIStore((state) => state.setAlarmSending);
	const setAlarmActive = useDeviceUIStore((state) => state.setAlarmActive);
	const setAlarmError = useDeviceUIStore((state) => state.setAlarmError);
	const clearAlarm = useDeviceUIStore((state) => state.clearAlarm);

	const [menuOpen, setMenuOpen] = useState(false);
	const [alarmDialogOpen, setAlarmDialogOpen] = useState(false);

	const [alarmState, setAlarmState] = useState<AlarmUIState>('idle');
	const [duration, setDuration] = useState<number>(10);
	const [lastResponse, setLastResponse] = useState<Callback | null>(null);

	const currentUser = row.original as Device;
	const deviceId = currentUser.androidId;

	const alarm = useDeviceUIStore((state) => (deviceId ? state.alarms[deviceId] : undefined));

	if (!currentUser.androidId || !currentUser.online) {
		return <span className='inline-flex items-center justify-center size-8 opacity-50'></span>;
	}

	const handleAction = (action: 'ping' | 'alert' | 'message') => {
		if (!currentUser.androidId) return;

		const callback: Callback = (response) => {
			console.log(`Respuesta del servidor para ${action}:`, response);
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

		// alarmActivate(payload, (response) => {
		// 	setLastResponse(response);

		// 	if (response?.status === 'OK') {
		// 		setAlarmState('active');
		// 	} else {
		// 		setAlarmState('error');
		// 	}
		// });

		setTimeout(() => {
			setAlarmState('active');
			setAlarmActive(deviceId!);

			setTimeout(() => {
				setAlarmError(deviceId!);

				setTimeout(() => {
					clearAlarm(deviceId!);
				}, 2000);
			}, 1000);
			
		}, 3000);
	};

	const handleCloseAlarmDialog = () => {
		resetAlarmUI();
		setAlarmDialogOpen(false);
	};

	const resetAlarmUI = () => {
		setAlarmState('idle');
		setLastResponse(null);
	};

	return (
		<div className='flex flex-col items-center gap-1'>
			<DropdownMenu
				open={menuOpen}
				onOpenChange={setMenuOpen}
			>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='h-8 w-8 p-0'
						disabled={!isConnected}
					>
						<span className='sr-only'></span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align='end'
					hidden={!isConnected}
				>
					<DropdownMenuItem onClick={() => handleAction('ping')}>Ping</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onSelect={(e) => {
							e.preventDefault();
							setMenuOpen(false);
							setAlarmDialogOpen(true);
						}}
					>
						<Bell className='mr-2 h-4 w-4' />
						Activar Alarma
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem onClick={() => handleAction('message')}>Mensaje</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{alarm?.state === 'sending' && (
				<Badge
					variant='secondary'
					className='text-xs'
				>
					Enviando alarma…
				</Badge>
			)}

			{alarm?.state === 'active' && (
				<Badge className='bg-red-600 text-xs'>
					<Bell className='h-3 w-3 mr-1' />
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

			<AlertDialog
				open={alarmDialogOpen}
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
									<Bell className='h-4 w-4 animate-pulse' />
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
							onClick={(e) => {
								e.preventDefault();
								handleActivateAlarm();
							}}
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

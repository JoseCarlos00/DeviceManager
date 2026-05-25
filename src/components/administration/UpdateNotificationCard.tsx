// components/administration/UpdateNotificationCard.tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { RefreshCw, Bell } from 'lucide-react';
import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import { useResponseHandler } from '@/hooks/useResponseHandler';
import { useAdminActionsStore } from '@/stores/adminActionsStore';
import { useAuthStore } from '@/stores/authStore';

interface UpdateNotificationCardProps {
	connectedDevices: number;
	totalDevices: number;
}

export default function UpdateNotificationCard({ connectedDevices, totalDevices }: UpdateNotificationCardProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isSending, setIsSending] = useState(false);

	const { CHECK_FOR_UPDATE_BROADCAST } = useDeviceActions();
	const { handleResponse } = useResponseHandler();
	const addAction = useAdminActionsStore((state) => state.addAction);
	const user = useAuthStore((state) => state.user);

	const offlineDevices = totalDevices - connectedDevices;

	const handleNotifyUpdates = () => {
		setIsSending(true);

		CHECK_FOR_UPDATE_BROADCAST((response) => {
			handleResponse(response, {
				successMessage: `Notificación enviada a ${connectedDevices} dispositivos`,
				icon: <RefreshCw className='h-4 w-4' />,
				addToLog: false,
			});

			if (response?.status === 'OK') {
				addAction({
					action: 'update_notification',
					executedBy: user?.username || 'Unknown',
					devicesAffected: connectedDevices,
					totalDevices,
					status: offlineDevices > 0 ? 'partial' : 'success',
					details: {
						offlineDevices,
						serverResponse: response,
					},
				});

				setDialogOpen(false);
			} else {
			console.error('Error:', response);
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
						<RefreshCw className='h-5 w-5' />
						Buscar Actualizaciones
					</CardTitle>
					<CardDescription>Notifica a todos los dispositivos para revisar actualizaciones</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='p-4 bg-muted rounded-md space-y-2'>
						<p className='text-sm font-medium'>Cómo funciona:</p>
						<ul className='text-sm text-muted-foreground space-y-1'>
							<li>• Se envía una notificación push a todos los dispositivos</li>
							<li>• Cada dispositivo revisa si hay actualizaciones disponibles</li>
							<li>• Los usuarios reciben una notificación si hay actualizaciones</li>
						</ul>
					</div>

					<div className='grid grid-cols-2 gap-4 text-center'>
						<div className='p-3 bg-green-50 dark:bg-green-950 rounded-md'>
							<p className='text-2xl font-bold text-green-600'>{connectedDevices}</p>
							<p className='text-xs text-muted-foreground'>Conectados</p>
						</div>
						<div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-md'>
							<p className='text-2xl font-bold text-muted-foreground'>{offlineDevices}</p>
							<p className='text-xs text-muted-foreground'>Desconectados</p>
						</div>
					</div>

					<Button
						onClick={() => setDialogOpen(true)}
						disabled={connectedDevices === 0}
						className='w-full cursor-pointer'
					>
						<Bell className='h-4 w-4 mr-2' />
						Notificar a todos los dispositivos
					</Button>

					<p className='text-xs text-muted-foreground'>
						ℹ️ Solo los dispositivos conectados recibirán la notificación.
					</p>
				</CardContent>
			</Card>

			<AlertDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>⚠️ ¿Notificar a {connectedDevices} dispositivos?</AlertDialogTitle>
						<AlertDialogDescription>
							Se enviará una notificación push a todos los dispositivos conectados para que revisen si hay
							actualizaciones disponibles.
							<div className='mt-4 p-3 bg-muted rounded-md space-y-2'>
								<p className='text-sm font-medium'>Resumen:</p>
								<ul className='text-sm space-y-1'>
									<li>• Dispositivos que recibirán notificación: {connectedDevices}</li>
									<li>• Dispositivos offline (no recibirán): {offlineDevices}</li>
									<li>• Cada dispositivo revisará de forma independiente</li>
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
								handleNotifyUpdates();
							}}
							disabled={isSending}
							className='bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
						>
							{isSending ? 'Enviando...' : 'Notificar'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

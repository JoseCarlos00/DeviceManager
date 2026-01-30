// components/administration/BroadcastMessageCard.tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { MessageSquare, Send } from 'lucide-react';
import { useDeviceAdminActions } from '@/contexts/DeviceActionsAdminContext';
import { useResponseHandler } from '@/hooks/useResponseHandler';
import { useAdminActionsStore } from '@/stores/adminActionsStore';
import { useAuthStore } from '@/stores/authStore';

interface BroadcastMessageCardProps {
	connectedDevices: number;
}

export default function BroadcastMessageCard({ connectedDevices }: BroadcastMessageCardProps) {
	const [message, setMessage] = useState('');
	const [sender, setSender] = useState('Admin');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isSending, setIsSending] = useState(false);

	const { SEND_BROADCAST_MESSAGE } = useDeviceAdminActions();
	const { handleResponse } = useResponseHandler();
	const addAction = useAdminActionsStore((state) => state.addAction);
	const user = useAuthStore((state) => state.user);

	const handleSendMessage = () => {
		if (!message.trim()) return;

		setIsSending(true);

		const payload = {
			dataMessage: {
				message: message.trim(),
				sender: sender.trim() || 'Admin',
			},
		};

		SEND_BROADCAST_MESSAGE(payload, (response) => {
			handleResponse(response, {
				successMessage: `Mensaje enviado a ${connectedDevices} dispositivos`,
				icon: <MessageSquare className='h-4 w-4' />,
			});

			if (response?.status === 'OK') {
				// Agregar al historial
				addAction({
					action: 'broadcast_message',
					executedBy: user?.username || 'Unknown',
					devicesAffected: connectedDevices,
					totalDevices: connectedDevices,
					status: 'success',
					details: {
						message: message.trim(),
						sender: sender.trim() || 'Admin',
						serverResponse: response,
					},
				});

				// Limpiar formulario
				setMessage('');
				setSender('Admin');
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
						<MessageSquare className='h-5 w-5' />
						Mensaje Broadcast
					</CardTitle>
					<CardDescription>Envía un mensaje a todos los dispositivos conectados</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='message'>Mensaje</Label>
						<Textarea
							id='message'
							placeholder='Escribe el mensaje que se enviará a todos los dispositivos...'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							rows={4}
							maxLength={500}
						/>
						<p className='text-xs text-muted-foreground text-right'>{message.length}/500 caracteres</p>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='sender'>Remitente (opcional)</Label>
						<Input
							id='sender'
							placeholder='Admin'
							value={sender}
							onChange={(e) => setSender(e.target.value)}
							maxLength={50}
						/>
					</div>

					<Button
						onClick={() => setDialogOpen(true)}
						disabled={!message.trim() || connectedDevices === 0}
						className='w-full'
					>
						<Send className='h-4 w-4 mr-2' />
						Enviar a todos ({connectedDevices} dispositivos)
					</Button>
				</CardContent>
			</Card>

			<AlertDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>⚠️ ¿Enviar mensaje a {connectedDevices} dispositivos?</AlertDialogTitle>
						<AlertDialogDescription>
							Este mensaje se mostrará inmediatamente en todos los dispositivos conectados.
							<div className='mt-4 p-3 bg-muted rounded-md'>
								<p className='text-sm font-medium'>Vista previa:</p>
								<p className='text-sm mt-2 italic'>"{message}"</p>
								<p className='text-xs text-muted-foreground mt-1'>— {sender || 'Admin'}</p>
							</div>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isSending}>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								handleSendMessage();
							}}
							disabled={isSending}
							className='bg-destructive hover:bg-destructive/90'
						>
							{isSending ? 'Enviando...' : 'Enviar a todos'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

import { useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { submittedEventServer } from '@/lib/constants';
import type { ClientToServerEvents, SendMessagePayload, SendDeviceIdPayload, Callback, CallbackResponse } from '@/types';

export function useEventEmitters(socketRef: React.RefObject<Socket | null>): ClientToServerEvents {
	const sendMessage: ClientToServerEvents[typeof submittedEventServer.SEND_MESSAGE] = useCallback(
		(payload: SendMessagePayload, callback?: Callback) => {
			if (socketRef.current?.connected) {
				socketRef.current
					.timeout(5000)
					.emit(submittedEventServer.SEND_MESSAGE, payload, (err: Error, response: CallbackResponse | null) => {
						if (err) {
							toast.error('El dispositivo no respondió al mensaje.');
							console.error('[WebSocket] Error al enviar el mensaje:');
							return;
						}

						callback?.(response);
					});
			} else {
				console.warn('[WebSocket] No se pudo enviar el mensaje, el socket no está conectado.');
				toast.warning('No se pudo realizar la acción', {
					description: 'No hay conexión con el servidor.',
				});
			}
		},
		[socketRef]
	);

	const sendPing: ClientToServerEvents[typeof submittedEventServer.SEND_PING] = useCallback(
		(payload: SendDeviceIdPayload, callback?: Callback) => {
			if (socketRef.current?.connected) {
				socketRef.current
					.timeout(5000)
					.emit(submittedEventServer.SEND_PING, payload, (err: Error, response: CallbackResponse | null) => {
						if (err) {
							toast.error('El dispositivo no respondió al PING.');
							console.error('[WebSocket] PING timeout:', payload.target_device_id);
							return;
						}

						callback?.(response);
					});
			} else {
				console.warn('[WebSocket] No se pudo enviar el PING, el socket no está conectado.');
				toast.warning('No se pudo realizar la acción', {
					description: 'No hay conexión con el servidor.',
				});
			}
		},
		[socketRef]
	);

	return {
		[submittedEventServer.SEND_MESSAGE]: sendMessage,
		[submittedEventServer.SEND_PING]: sendPing,
	};
}

// hooks/useDeviceWebSocket/socketEmitters.ts
import type { Socket } from 'socket.io-client';
import { submittedEventServer as SocketEvent} from "@/lib/constants";
import type {
	ClientToServerEvents,
	SendMessagePayload,
	SendDeviceIdPayload,
	Callback,
} from '@/types/websocket';

export const createSocketEmitters = (socketRef: React.RefObject<Socket | null>) => {
  const emit = <E extends keyof ClientToServerEvents>(
    event: E, 
    ...args: Parameters<ClientToServerEvents[E]>
  ) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, ...args);
    } else {
      console.warn(`[WebSocket] No conectado, no se puede emitir: ${event}`);
      
      const callback = args[args.length - 1];
      if (typeof callback === 'function') {
        callback(null);
      }
    }
  };

  const sendMessage = (payload: SendMessagePayload, callback: Callback) => {
    emit(SocketEvent.SEND_MESSAGE, payload, callback);
  };

  const sendPing = (payload: SendDeviceIdPayload, callback: Callback) => {
    emit(SocketEvent.SEND_PING, payload, callback);
  };

  return {
    emit,
    sendMessage,
    sendPing,
  };
};

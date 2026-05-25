import { useState } from 'react';
import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import { AutoFocusInput } from '@/components/ui/AutoFocusInput';
import type { Row } from '@tanstack/react-table';
import type { Device } from '@/types';
import { useDeviceUIStore } from '@/stores/tableStore';
import { useResponseHandler } from '@/hooks/useResponseHandler';

interface AndroidIdCellProps {
  row: Row<Device>;
}

export function AndroidIdCell({ row }: AndroidIdCellProps) {
  const [isSending, setIsSending] = useState(false);
  const device = row.original;
  const androidId = device.androidId;
  const messageRowId = useDeviceUIStore((state) => state.messageRowId);
	const messageText = useDeviceUIStore((state) => state.messageText);
  const setMessageRowId = useDeviceUIStore((state) => state.setMessageRowId);
  const setMessageText = useDeviceUIStore((state) => state.setMessageText);

  const { SEND_MESSAGE, isConnected } = useDeviceActions();
  const { handleResponse } = useResponseHandler();

  if (messageRowId === row.id) {
    return (
      <AutoFocusInput
        className='h-7'
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder='Escribe el mensaje'
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (!messageText.trim() || !androidId) return;

            setIsSending(true);
            SEND_MESSAGE(
              {
                target_device_id: androidId,
                dataMessage: {
                  message: messageText,
                  sender: 'Admin',
                },
              },
              (response) => {
                setIsSending(false);
                handleResponse(response);
                
                // Cerramos el input solo cuando recibimos respuesta
                setMessageRowId(null);
                setMessageText('');
              }
            );
          } else if (e.key === 'Escape') {
            setMessageRowId(null);
            setMessageText('');
          }
        }}
        disabled={!isConnected || isSending}
      />
    );
  }

  return (
    <div className='font-mono text-sm'>
      {androidId || <span className='text-muted-foreground'>N/A</span>}
    </div>
  );
}

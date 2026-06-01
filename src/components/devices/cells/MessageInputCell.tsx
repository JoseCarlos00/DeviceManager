import { useState } from 'react';
import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import { AutoFocusInput } from '@/components/ui/AutoFocusInput';
import type { Row } from '@tanstack/react-table';
import type { Device } from '@/types';
import { useDeviceUIStore } from '@/stores/tableStore';
import { useResponseHandler }
 from '@/hooks/useResponseHandler';

interface MessageInputCellProps {
  row: Row<Device>;
}

export function MessageInputCell({ row }: MessageInputCellProps) {
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
			<div className='absolute left-0 top-0 bottom-0 z-50 flex items-center bg-background pl-1 pr-4 rounded-md shadow-md min-w-87.5 border border-primary/20 animate-in fade-in slide-in-from-left-2 duration-200'>
				<AutoFocusInput
					className='h-7 flex-1'
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
					placeholder='Escribe el mensaje...'
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							if (!messageText.trim() || !androidId) return;

							setIsSending(true);
							SEND_MESSAGE(
								{ target_device_id: androidId, dataMessage: { message: messageText, sender: 'Admin' } },
								(response) => {
									setIsSending(false);
									handleResponse(response);
									setMessageRowId(null);
									setMessageText('');
								},
							);
						} else if (e.key === 'Escape') {
							setMessageRowId(null);
							setMessageText('');
						}
					}}
					disabled={!isConnected || isSending}
				/>
			</div>
		);
  }

  return null; // Render nothing if this row is not the one for the message input
}

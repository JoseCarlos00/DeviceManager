import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import { AutoFocusInput } from '@/components/ui/AutoFocusInput';
import type { Row } from '@tanstack/react-table';
import type { Device } from '@/types';
import { useDeviceUIStore } from '@/stores/tableStore';
import { useLogStore } from "@/stores/historyLogs";

interface AndroidIdCellProps {
  row: Row<Device>;
}

export function AndroidIdCell({ row }: AndroidIdCellProps) {
  const androidId = row.getValue('androidId') as string | null;
  const messageRowId = useDeviceUIStore((state) => state.messageRowId);
	const messageText = useDeviceUIStore((state) => state.messageText);
  const setMessageRowId = useDeviceUIStore((state) => state.setMessageRowId);
  const setMessageText = useDeviceUIStore((state) => state.setMessageText);
  const addLog = useLogStore((state) => state.addLog);

  const { SEND_MESSAGE } = useDeviceActions();

  if (messageRowId === row.id) {
    return (
      <AutoFocusInput
        className='h-7'
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder='Escribe el mensaje'
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            SEND_MESSAGE(
              {
                target_device_id: androidId!,
                dataMessage: {
                  message: messageText,
                  sender: 'Admin',
                },
              },
              (response) => {
               if (response?.status === 'OK') {
									addLog(response.message, 'success');
								} else {
									addLog(response?.message ?? 'Error al ejecutar acción', 'error');
								}
              }
            );
            setMessageRowId(null);
            setMessageText('');
          }
          if (e.key === 'Escape') {
            setMessageRowId(null);
            setMessageText('');
          }
        }}
      />
    );
  }

  return (
    <div className='font-mono text-sm'>
      {androidId || <span className='text-muted-foreground'>N/A</span>}
    </div>
  );
}

import type { HTMLAttributes } from 'react';
import type { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Device } from '@/types';
import { submittedEventServer } from '@/lib/constants';
import type { EventSubmittedHandlers, Callback } from '@/types';

interface ActionsMenuProps<TValue> extends HTMLAttributes<HTMLDivElement> {
	row: Row<TValue>;
	emitEvent: EventSubmittedHandlers;
	table: any; // Recibimos la tabla directamente
	isConnected: boolean;
}

export default function ActionsMenu<TValue>({ row, emitEvent, isConnected, table }: ActionsMenuProps<TValue>) {
	const currentUser = row.original as Device;

	if (!currentUser.androidId || !currentUser.online) {
		return (
			<span className='inline-flex items-center justify-center size-8 opacity-50'>
			</span>
		);
	}


	const handleAction = (action: 'ping' | 'alert' | 'message') => {
		if (!currentUser.androidId) return;

		

		const callback: Callback = (response) => {
			console.log(`Respuesta del servidor para ${action}:`, response);
		};

		if (action === 'ping') {
			const payload = {
				target_device_id: currentUser.androidId
			};
			
			emitEvent[submittedEventServer.SEND_PING](payload, callback);
			console.log(`Enviando PING a ${currentUser.androidId}`);
		}
		if(action === 'message') {
			const meta = table.options.meta;
			meta.setMessageRowId(row.id);
		}

	};

	return (
		<DropdownMenu>
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
				<DropdownMenuItem onClick={() => handleAction('alert')}>Alerta</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => handleAction('message')}>Mensaje</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

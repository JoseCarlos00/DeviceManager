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

type ActionType = 'ping' | 'alert' | 'message';

interface ActionsMenuProps<TValue> extends HTMLAttributes<HTMLDivElement> {
	row: Row<TValue>;
	sendPing: (payload: { target_device_id: string }) => void;
	isConnected: boolean;
}

export default function ActionsMenu<TValue>({ row, sendPing, isConnected }: ActionsMenuProps<TValue>) {
	const currentUser = row.original as Device;
	
	if (!currentUser.androidId || !currentUser.online) {
		return (
			<span className='inline-flex items-center justify-center size-8 opacity-50'>
			</span>
		);
	}


	const handleAction = (action: ActionType) => {
		if (!currentUser.androidId) return;

		const payload = {
			target_device_id: currentUser.androidId,
		};

		if (action === 'ping') {
			sendPing(payload);
			console.log(`Enviando PING a ${currentUser.androidId}`);
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

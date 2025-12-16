import type { HTMLAttributes } from 'react';
import type { Row } from '@tanstack/react-table';
import { MoreHorizontal, Ellipsis } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Device } from '@/types';

interface ActionsMenuProps<TValue> extends HTMLAttributes<HTMLDivElement> {
	row: Row<TValue>;
}

export default function ActionsMenu<TValue>({ row }: ActionsMenuProps<TValue>) {
	const isConnected = true;
	const currentUser = row.original as Device;
	
	if (!currentUser.androidId) {
		return (
			<span className='inline-flex items-center justify-center size-8 opacity-50'>
				{/* <Ellipsis className='size-4' /> */}
			</span>
		);
	}

	const handleAction = (action: 'ping' | 'alert' | 'message') => {
		if (!currentUser.androidId) return;

		const payload = {
			targetId: currentUser.androidId,
			// Puedes añadir más datos aquí si es necesario
		};

		// sendMessage(action, payload);
		console.log(`Enviando '${action}' a ${currentUser.androidId}`);
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

import type { Device } from '@/types';
import type { Row } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

import { MessageInputCell } from './MessageInputCell';

export default function StateCell({ row }: { row: Row<Device> }) {
	const online = row.getValue('online') as boolean | undefined;

	return (
		<div className='relative w-fit sm:w-31'>
			{online === undefined ? (
				<Badge
					variant='secondary'
					className='gap-1 w-fit sm:w-28 justify-start'
				>
					<span className='h-2 w-2 rounded-full bg-gray-400' />
					<span className='hidden sm:inline'>Desconocido</span>
				</Badge>
			) : online ? (
				<Badge
					variant='default'
					className='bg-green-600 hover:bg-green-700 w-fit sm:w-28 justify-start gap-1'
				>
					<Wifi className='h-3 w-3' />
					<span className='tracking-[0.06rem] hidden sm:inline'>Conectado</span>
				</Badge>
			) : (
				<Badge
					variant='secondary'
					className='w-fit sm:w-28 justify-start gap-1'
				>
					<WifiOff className='h-3 w-3' />
					<span className='hidden sm:inline'>Desconectado</span>
				</Badge>
			)}

			<MessageInputCell row={row} />
		</div>
	);
}

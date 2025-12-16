import type { Device, EventSubmittedHandlers } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

import DataTableColumnHeader from '@/components/devices/DataTableHeader';
import ActionsMenu from './ActionMenu';

interface DeviceTableMeta {
	emitEvent: EventSubmittedHandlers;
	isConnected: boolean;
}

export const columns: ColumnDef<Device>[] = [
	{
		id: 'actions',
		cell: ({ row, table }) => {
			const meta = table.options.meta as DeviceTableMeta;
			return <ActionsMenu row={row} emitEvent={meta.emitEvent} isConnected={meta.isConnected} />;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'online',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Estado'
			/>
		),
		cell: ({ row }) => {
			const online = row.getValue('online') as boolean | undefined;

			if (online === undefined) {
				return (
					<Badge
						variant='secondary'
						className='gap-1'
					>
						<span className='h-2 w-2 rounded-full bg-gray-400' />
						Desconocido
					</Badge>
				);
			}

			return online ? (
				<Badge variant='default' className='gap-1 bg-green-600 hover:bg-green-700'>
					<Wifi className='h-3 w-3' />
					Conectado
				</Badge>
			) : (
				<Badge variant='secondary' className='gap-1'>
					<WifiOff className='h-3 w-3' />
					Desconectado
				</Badge>
			);
		},
		enableHiding: false,
		filterFn: (row, id, value) => {
			if (value === null) return true;

			return row.getValue(id) === value;
		},
	},
	{
		accessorKey: 'androidId',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Android Id'
			/>
		),
		cell: ({ row }) => {
			const androidId = row.getValue('androidId') as string | null;
			return <div className='font-mono text-sm'>{androidId || <span className='text-muted-foreground'>N/A</span>}</div>;
		},
	},
	{
		accessorKey: 'equipo',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Equipo'
			/>
		),
	},
	{
		accessorKey: 'modelo',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Modelo'
			/>
		),
	},
	{
		accessorKey: 'usuario',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Usuario'
			/>
		),
		cell: (props) => <span className='font-medium'>{props.row.original.usuario}</span>,
	},
	{
		accessorKey: 'correo',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Correo'
			/>
		),
	},
	{
		accessorKey: 'aliasUsuario',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Alias Usuario'
			/>
		),
	},
	{
		accessorKey: 'ipAddress',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='IP'
			/>
		),
		cell: ({ row }) => {
			const ip = row.getValue('ipAddress') as string | undefined;
			return ip ? (
				<div className='font-mono text-xs'>{ip}</div>
			) : (
				<span className='text-muted-foreground text-xs'>N/A</span>
			);
		},
	},
];

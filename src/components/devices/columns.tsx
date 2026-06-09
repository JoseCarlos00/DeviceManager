import type { Device } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

import DataTableColumnHeader from '@/components/devices/DataTableHeader';
import ActionsMenu from './ActionMenu';
import { VersionCell } from './cells/VersionCell'
import StateCell from './cells/StateCell'

export const columns: ColumnDef<Device>[] = [
	{
		id: 'actions',
		header: () => <div className='w-30' />,
		cell: ({ row }) => {
			return <ActionsMenu row={row} />;
		},
		size: 120,
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
		cell: ({ row }) => <StateCell row={row} />,
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
		cell: ({ row }) => (
			<div className='font-mono text-sm'>
				{row.original.androidId || <span className='text-muted-foreground'>N/A</span>}
			</div>
		),
		enableHiding: true,
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
	{
		accessorKey: 'appVersion',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Versión'
			/>
		),
		cell: ({ row }) => <VersionCell version={row.original.appVersion} />,
	},
];

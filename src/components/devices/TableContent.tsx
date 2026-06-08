import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, WifiIcon, WifiOffIcon, RefreshCw } from 'lucide-react';

import { type Device } from '@/types';
import { columns as deviceColumns } from '@/components/devices/columns';
import DataTable from '@/components/devices/DataTable';
import DataTableViewOptions from '@/components/devices/DataTableViewOptions';

import { useDeviceActions } from '@/contexts/DeviceActionsContext';
import TerminalResponses from './TerminalResponse'
import StatusConnection from '../StatusConnection'
import { cn } from '@/lib/utils'

const nameStorageFilterColumn = 'devices-online-filter';
export const nameStorageColumnVisibility = 'devices-column-visibility';

export default function TableContent() {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
		try {
			const saved = localStorage.getItem(nameStorageFilterColumn);
			if (saved === null) return [];
			const value = JSON.parse(saved) as boolean;
			return [{ id: 'online', value }];
		} catch {
			return [];
		}
	});

	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
		try {
			const saved = localStorage.getItem(nameStorageColumnVisibility);
			if (saved) return JSON.parse(saved) as VisibilityState;
		} catch {
			// ignore
		}

		// Default: androidId oculto
		return { androidId: false, appVersion: false};
	});
	
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState('');
	const [highlightFilter, setHighlightFilter] = useState(() => localStorage.getItem(nameStorageFilterColumn) !== null);

	const columns = useMemo<ColumnDef<Device>[]>(() => deviceColumns, []);
	const { devices, isRefreshing, refresh } = useDeviceActions();

	const connectedDevices = devices.filter((d) => d.online).length;
	const totalDevices = devices.length;

	const tableState = useMemo(
		() => ({ sorting, columnFilters, columnVisibility, globalFilter }),
		[sorting, columnFilters, columnVisibility, globalFilter],
	);

	const table = useReactTable({
		data: devices,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: (updater) => {
		setColumnVisibility((prev) => {
			const next = typeof updater === 'function' ? updater(prev) : updater;
			localStorage.setItem(nameStorageColumnVisibility, JSON.stringify(next));
			return next;
			});
		},
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: tableState,
	});

	// Estado de carga inicial
	if (devices.length === 0 && isRefreshing) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-xl'>Inventario de Dispositivos</CardTitle>
					<CardDescription>Cargando dispositivos...</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-center py-8'>
						<RefreshCw className='h-8 w-8 animate-spin text-muted-foreground' />
					</div>
				</CardContent>
			</Card>
		);
	}

	// Sin dispositivos después de cargar
	if (devices.length === 0 && !isRefreshing) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-xl'>Inventario de Dispositivos</CardTitle>
					<CardDescription>Gestión y monitoreo de dispositivos en red</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-center text-sm text-muted-foreground'>No se encontraron dispositivos en el inventario.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-6 h-full pt-2'>
			<StatusConnection
				connectedDevices={connectedDevices}
				totalDevices={totalDevices}
			/>

			<Card className='flex flex-col h-full'>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<CardDescription>Gestión y monitoreo de dispositivos</CardDescription>

						{/* Indicador de conexión y botón refresh */}
						<div className='flex items-center gap-2'>
							<Button
								className='cursor-pointer'
								variant='outline'
								size='sm'
								onClick={refresh}
								disabled={isRefreshing}
							>
								<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
								<span className='cursor-pointer ml-2 hidden sm:inline'>{isRefreshing ? 'Actualizando...' : 'Refrescar'}</span>
							</Button>
						</div>
					</div>

					<div className='mb-4 flex flex-wrap gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								placeholder='Filtrar tabla...'
								value={globalFilter ?? ''}
								onChange={(event) => setGlobalFilter(event.target.value)}
								className='pl-10'
							/>
						</div>

						<Select
							value={
								(table.getColumn('online')?.getFilterValue() === true && 'Conectado') ||
								(table.getColumn('online')?.getFilterValue() === false && 'Desconectado') ||
								'all'
							}
							onValueChange={(value) => {
								setHighlightFilter(false);
								const filterValue = value === 'Conectado' ? true : value === 'Desconectado' ? false : null;
								table.getColumn('online')?.setFilterValue(filterValue);

								// Persistir en localStorage
								if (filterValue === null) {
									localStorage.removeItem(nameStorageFilterColumn);
								} else {
									localStorage.setItem(nameStorageFilterColumn, JSON.stringify(filterValue));
								}
							}}
						>
							<SelectTrigger className={cn('cursor-pointer sm:w-48', highlightFilter && 'ring-amber-300/40 border-amber-200')}>
								<SelectValue placeholder='Filtrar por estado' />
							</SelectTrigger>
							<SelectContent className='sm:w-48'>
								<SelectItem
									className='sm:w-48'
									value='all'
								>
									<WifiIcon className='inline-block' />
									<span className='ml-2 inline'>Todos</span>
								</SelectItem>
								<SelectItem
									className='sm:w-48'
									value='Conectado'
								>
									<WifiIcon className='inline-block' />
									<span className='ml-2 inline'>Conectados</span>
								</SelectItem>
								<SelectItem
									className='sm:w-48'
									value='Desconectado'
								>
									<WifiOffIcon className='inline-block' />
									<span className='ml-2 inline'>Desconectados</span>
								</SelectItem>
							</SelectContent>
						</Select>

						<DataTableViewOptions table={table} />
					</div>

					<TerminalResponses />
				</CardHeader>

				<CardContent className='grow flex'>
					<DataTable
						columns={columns}
						table={table}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

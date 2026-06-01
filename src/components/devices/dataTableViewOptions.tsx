import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import type { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function DataTableViewOptions<TData>({ table }: { table: Table<TData> }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex cursor-pointer!'>
					<Settings2 className='mr-1 h-4 w-4' />
					View
				</Button>
			</DropdownMenuTrigger>
			
			<DropdownMenuContent align='end' className='w-37.5'>
				<DropdownMenuLabel>Ocultar Columnas</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className={cn(
									'cursor-pointer capitalize',
									!column.getIsVisible() && 'opacity-50'
								)}
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
								onSelect={(e) => e.preventDefault()}
							>
								{column.id}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

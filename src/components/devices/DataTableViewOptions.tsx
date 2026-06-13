import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import type { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function DataTableViewOptions<TData>({ table }: { table: Table<TData> }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild> 
				<Button variant='outline' size='sm' className='w-full sm:w-auto sm:ml-auto flex h-8 cursor-pointer!'>
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

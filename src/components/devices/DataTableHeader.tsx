import type { HTMLAttributes } from 'react';
import type { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
	title: string;
	column: Column<TData, TValue>;
}

export default function DataTableColumnHeader<TData, TValue>({
	title,
	column,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	const sorted = column.getIsSorted();

	return (
		<div
			className={cn('flex items-center gap-1.5 cursor-pointer select-none', className)}
			onClick={() => column.toggleSorting(sorted === 'asc')}
		>
			<span className='text-sm font-medium'>{title}</span>
			{sorted === 'asc' ? (
				<ArrowUp className='h-3.5 w-3.5 text-foreground' />
			) : sorted === 'desc' ? (
				<ArrowDown className='h-3.5 w-3.5 text-foreground' />
			) : (
				<ArrowUpDown className='h-3.5 w-3.5 text-muted-foreground' />
			)}
		</div>
	);
}

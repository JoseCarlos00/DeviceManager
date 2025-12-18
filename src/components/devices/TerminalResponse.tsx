import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { useLogStore } from '@/stores/historyLogs';

export default function TerminalResponses() {
	const logs = useLogStore((state) => state.logs);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [logs]);

	return (
		<div className='relative'>
			<Terminal className='h-4 w-4 text-green-700 dark:text-green-400 absolute top-2 left-1 animate-pulse' />
			<div
				ref={scrollRef}
				className='h-20 overflow-y-auto rounded-lg bg-black/50 p-4 pl-5 font-mono text-sm'
			>
				{logs.length === 0 ? (
					<p className='text-muted-foreground'>No hay eventos para mostrar</p>
				) : (
					<div className='space-y-1'>
						{logs.map((log) => (
							<div
								key={log.id}
								className='flex gap-3'
							>
								<span className='text-muted-foreground'>[{log.timestamp}]</span>
								<span
									className={
										log.type === 'success'
											? 'text-green-400'
											: log.type === 'error'
											? 'text-red-400'
											: log.type === 'warning'
											? 'text-yellow-400'
											: 'text-blue-400'
									}
								>
									{log.message}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

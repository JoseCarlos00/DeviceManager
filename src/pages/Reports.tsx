import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Bell, Smartphone, TrendingUp, RefreshCw, Trash2, BarChart3 } from 'lucide-react';
import { reportsApi, type DeviceLossReport, type DeviceAlarmStat } from '@/lib/api/reports';
import { useDeviceActions } from '@/contexts/DeviceActionsContext';

const getApiError = (error: unknown, fallback: string): string => {
	if (isAxiosError(error)) return error.response?.data?.error ?? fallback;
	return fallback;
};

function SummaryCard({
	icon: Icon,
	label,
	value,
	sub,
}: {
	icon: React.ElementType;
	label: string;
	value: string | number;
	sub?: string;
}) {
	return (
		<Card>
			<CardContent className='pt-6'>
				<div className='flex items-start justify-between'>
					<div className='space-y-1'>
						<p className='text-sm text-muted-foreground'>{label}</p>
						<p className='text-3xl font-bold'>{value}</p>
						{sub && <p className='text-xs text-muted-foreground'>{sub}</p>}
					</div>
					<div className='p-2 rounded-md bg-muted'>
						<Icon className='h-5 w-5 text-muted-foreground' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default function ReportsPage() {
	const { devices } = useDeviceActions();

	const [report, setReport] = useState<DeviceLossReport | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
	const [isCleaning, setIsCleaning] = useState(false);

	// Build a lookup map: androidId → equipo name
	const deviceNameMap = new Map(
		devices
			.filter((d) => d.androidId)
			.map((d) => [d.androidId as string, {equipo: d.equipo, usuario: d.usuario}])
	);

	const fetchReport = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await reportsApi.getDevices(30);
			setReport(data);
		} catch (error) {
			toast.error('Error al cargar el reporte', {
				description: getApiError(error, 'No se pudo obtener el reporte.'),
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchReport();
	}, [fetchReport]);

	const handleCleanup = async () => {
		setIsCleaning(true);
		try {
			const res = await reportsApi.cleanup(90);
			toast.success(res.message);
			setCleanupDialogOpen(false);
			await fetchReport();
		} catch (error) {
			toast.error('Error al limpiar datos', {
				description: getApiError(error, 'No se pudo completar la limpieza.'),
			});
		} finally {
			setIsCleaning(false);
		}
	};

	return (
		<div className='space-y-6 pt-2'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-semibold flex items-center gap-2'>
						<BarChart3 className='h-5 w-5' />
						Reportes
					</h1>
					<p className='text-sm text-muted-foreground mt-0.5'>
						Métricas de alarmas — últimos 30 días
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={fetchReport}
						disabled={isLoading}
						className='cursor-pointer'
					>
						<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
						<span className='hidden sm:inline ml-1'>
							{isLoading ? 'Cargando...' : 'Refrescar'}
						</span>
					</Button>

					<Button
						variant='outline'
						size='sm'
						onClick={() => setCleanupDialogOpen(true)}
						disabled={isLoading}
						className='cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30'
					>
						<Trash2 className='h-4 w-4' />
						<span className='hidden sm:inline ml-1'>Limpiar datos</span>
					</Button>
				</div>
			</div>

			{/* Summary cards */}
			<div className='grid gap-4 sm:grid-cols-3'>
				<SummaryCard
					icon={Bell}
					label='Total de alarmas'
					value={isLoading ? '—' : (report?.totalAlarms ?? 0)}
					sub={report ? `en ${report.period}` : undefined}
				/>
				<SummaryCard
					icon={Smartphone}
					label='Dispositivos afectados'
					value={isLoading ? '—' : (report?.devicesAffected ?? 0)}
					sub='con al menos 1 alarma'
				/>
				<SummaryCard
					icon={TrendingUp}
					label='Promedio diario'
					value={isLoading ? '—' : (report?.averageAlarmsPerDay.toFixed(2) ?? '0.00')}
					sub='alarmas por día'
				/>
			</div>

			{/* Devices table */}
			<Card>
				<CardHeader>
					<CardTitle className='text-base'>Dispositivos con alarmas</CardTitle>
					<CardDescription>
						{report
							? `${report.allDevices.length} dispositivo${report.allDevices.length !== 1 ? 's' : ''} en ${report.period}`
							: 'Cargando...'}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className='flex items-center justify-center py-12'>
							<RefreshCw className='h-5 w-5 animate-spin text-muted-foreground' />
						</div>
					) : !report || report.allDevices.length === 0 ? (
						<p className='text-center text-sm text-muted-foreground py-12'>
							No hay datos de alarmas para este período.
						</p>
					) : (
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='w-8'>#</TableHead>
										<TableHead>Equipo</TableHead>
										<TableHead className='text-right'>Total alarmas</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{report.allDevices.map((device: DeviceAlarmStat, index: number) => {
										const currentDevice = deviceNameMap.get(device.device_id);

										return (
											<TableRow key={device.device_id}>
												<TableCell className='text-muted-foreground text-xs'>{index + 1}</TableCell>
												<TableCell>
													{currentDevice ? (
														<div>
															<p className='font-medium text-sm'>{currentDevice.equipo}</p>
															<p className='font-mono text-xs text-muted-foreground'>{device.device_id}</p>
															<p className='font-mono text-xs text-muted-foreground'>{currentDevice.usuario || '-'}</p>
														</div>
													) : (
														<p className='font-mono text-xs text-muted-foreground'>{device.device_id}</p>
													)}
												</TableCell>
												<TableCell className='text-right font-semibold'>{device.total_alarms}</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Cleanup dialog */}
			<AlertDialog open={cleanupDialogOpen} onOpenChange={setCleanupDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Limpiar datos antiguos?</AlertDialogTitle>
						<AlertDialogDescription>
							Se eliminarán todos los registros de alarmas con más de{' '}
							<span className='font-semibold text-foreground'>90 días</span> de antigüedad.
							Esta acción no se puede deshacer.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isCleaning} className='cursor-pointer'>
							Cancelar
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								handleCleanup();
							}}
							disabled={isCleaning}
							className='bg-destructive hover:bg-destructive/90 cursor-pointer'
						>
							{isCleaning ? 'Limpiando...' : 'Limpiar'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

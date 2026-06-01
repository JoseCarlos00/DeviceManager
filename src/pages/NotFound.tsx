import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	const navigate = useNavigate();
	return (
		<div className='min-h-screen flex flex-col items-center justify-center gap-4 text-center'>
			<p className='text-6xl font-bold text-muted-foreground'>404</p>
			<p className='text-lg font-medium'>Página no encontrada</p>
			<p className='text-sm text-muted-foreground'>La ruta que buscas no existe.</p>
			<Button
				onClick={() => navigate('/dashboard')}
				className='cursor-pointer'
			>
				Volver al dashboard
			</Button>
		</div>
	);
}

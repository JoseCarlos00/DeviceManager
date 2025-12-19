import {useSearchParams } from 'react-router-dom'
import LoginForm from '@/components/auth/LoginForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';


export default function LoginPage() {
  const [searchParams] = useSearchParams();

	const errorMessage = searchParams.get('error') ?? '';
	const successMessage = searchParams.get('message') ?? '';

	return (
		<div className='min-h-screen flex items-center justify-center bg-background p-4'>
			<div className='absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]'></div>

			<div className='w-full max-w-md px-4'>
				<div className='mb-8 text-center relative'>
					<img src="icon_logo.png" className='size-20 mx-auto rounded-[50%]' alt="Logo" />
					<h1 className='text-3xl font-bold text-foreground mb-2'>Devices Admin</h1>
					<p className='text-muted-foreground mt-2'>Panel de Administración</p>
				</div>

				{successMessage === 'logout_success' && (
					<Alert className='mb-4 border-green-500/50 text-green-700 dark:text-green-400'>
						<Terminal className='h-4 w-4 text-green-700 dark:text-green-400' />
						<AlertTitle className='text-green-800 dark:text-green-300'>Sesión Cerrada</AlertTitle>
						<AlertDescription>Has cerrado sesión exitosamente.</AlertDescription>
					</Alert>
				)}

				{errorMessage === 'session_expired' && (
					<Alert
						variant='destructive'
						className='mb-4'
					>
						<Terminal className='h-4 w-4' />
						<AlertTitle>Sesión Expirada</AlertTitle>
						<AlertDescription>Tu sesión ha expirado. Por favor, inicia sesión de nuevo.</AlertDescription>
					</Alert>
				)}

				<LoginForm />
			</div>
		</div>
	);
}

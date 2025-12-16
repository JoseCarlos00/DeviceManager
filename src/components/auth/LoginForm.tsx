import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';

export default function LoginForm() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { login } = useAuthStore();


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Usamos la función centralizada
			await login(username, password);
			navigate('/dashboard');

		} catch (error) {
			let errorMessage = 'Error al iniciar sesión';

			if (error instanceof Error) {
				errorMessage = error.message;
			}
			
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Iniciar Sesión</CardTitle>
				<CardDescription>Ingresa tus credenciales para acceder al panel</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit}
					className='space-y-4'
				>
					<div className='space-y-2'>
						<Label htmlFor='username'>Usuario</Label>
						<Input
							id='username'
							type='username'
							placeholder='usuario'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='password'>Contraseña</Label>
						<Input
							id='password'
							type='password'
							placeholder='********'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					{error && <p className='text-sm text-red-500'>{error}</p>}
					<Button
						type='submit'
						className='w-full'
						disabled={isLoading}
					>
						{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

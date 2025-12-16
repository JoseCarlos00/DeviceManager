// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { login, isAuthenticated } = useAuthStore();

	// Si ya está autenticado, redirige
	useEffect(() => {
		if (isAuthenticated) {
			navigate('/dashboard', { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await login(username, password);
			navigate('/dashboard');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-background'>
			<div className='w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg border'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold'>Device Manager</h1>
					<p className='text-muted-foreground mt-2'>Inicia sesión en tu cuenta</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className='space-y-4'
				>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium mb-2'
						>
							Email
						</label>
						<input
							id='email'
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className='w-full px-3 py-2 border rounded-md bg-background'
							placeholder='Juan'
							required
							disabled={loading}
						/>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium mb-2'
						>
							Contraseña
						</label>
						<input
							id='password'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full px-3 py-2 border rounded-md bg-background'
							placeholder='••••••••'
							required
							disabled={loading}
						/>
					</div>

					{error && <div className='p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-md'>{error}</div>}

					<button
						type='submit'
						disabled={loading}
						className='w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
					>
						{loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
					</button>
				</form>
			</div>
		</div>
	);
}

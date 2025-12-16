'use client';

// import { useUser } from '@/hooks/use-user';
// import RoleBadge from '@/components/auth/role-badge';
// import { UserRole } from '@/lib/auth/roles';
// import { LogoutButton } from '../logout-button'
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';

interface AppHeaderProps {
	onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: AppHeaderProps) {
	// const user = useUser((state) => state.user);
	const user = { username: 'Juan', role: 'admin' };

	return (
		<header className='bg-card border-b border-border'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
				<div className='flex items-center justify-between h-12'>
					<Button variant="ghost" size="icon" className="lg:hidden cursor-pointer" onClick={onMenuClick}>
						<Menu className="h-6 w-6" />
						<span className="sr-only">Abrir menú</span>
					</Button>
					{/* Sección Izquierda: Título y Saludo */}
					<div>
						<h1 className='text-2xl font-bold text-foreground'>Dashboard</h1>
						<p className='mt-1 text-sm text-muted-foreground'>
							Bienvenido de nuevo, {user?.username ?? 'invitado'} 👋
						</p>
					</div>

					{/* Sección Derecha: Info de Usuario y Logout */}
					{user && (
						<div className='flex items-center gap-4'>
							<div className='text-right hidden sm:block'>
								<p className='font-semibold text-sm text-foreground'>{user.username}</p>
								{/* <RoleBadge role={user.role as UserRole} /> */}
							</div>
							{/* <LogoutButton /> */}
						</div>
					)}
					</div>
				</div>
		</header>
	);
}

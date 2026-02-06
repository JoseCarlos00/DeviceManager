import RoleBadge from '@/components/RoleBadge';
import { UserRole } from '@/lib/roles';
import { LogoutButton } from '@/components/LogoutButton'
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/authStore';

import logo from '@/assets/icon_logo.png'
import { useDeviceActions } from '@/contexts/DeviceActionsContext'
import ConnectionIndicator from '../ConnectionIndicator'


interface AppHeaderProps {
	onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: AppHeaderProps) {
	const { user } = useAuthStore();
	const { isConnected } = useDeviceActions();

	return (
		<header className='bg-card border-b border-border'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
				<div className='flex items-center justify-between h-12'>
					<Button variant="ghost" size="icon" className="lg:hidden cursor-pointer" onClick={onMenuClick}>
						<Menu className="h-6 w-6" />
						<span className="sr-only">Abrir menú</span>
					</Button>

					<div>
						<img src={logo} alt="Logo" className='h-11 w-auto rounded-[50%] inline-block mr-2.5'/>
						<p className='mt-1 text-sm text-muted-foreground inline'>
							Bienvenido de nuevo, {user?.username ?? 'invitado'} 👋
						</p>
						<ConnectionIndicator isConnected={isConnected} />
					</div>

					{user && (
						<div className='flex items-center gap-4'>
							<div className='text-right hidden sm:block'>
								<RoleBadge role={user.role as UserRole} />
							</div>
							<LogoutButton />
						</div>
					)}
					</div>
				</div>
		</header>
	);
}

import { Link, useLocation } from 'react-router-dom';
import { Home, Users, PanelLeftClose, BarChart3, MessageSquare, Wrench } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ProtectedContent } from '@/components/auth/protectedContent';
import { UserRole } from '@/lib/roles';

const navItems = [
	{ href: '/dashboard', label: 'Dispositivos', icon: Home },
	{ href: '/dashboard/broadcast', label: 'Broadcast', icon: MessageSquare },
	{ href: '/dashboard/maintenance', label: 'Mantenimiento', icon: Wrench, requiredRole: UserRole.ADMIN },
	{ href: '/dashboard/reports', label: 'Reportes', icon: BarChart3, requiredRole: UserRole.ADMIN },
	{ href: '/dashboard/users', label: 'Usuarios', icon: Users, requiredRole: UserRole.SUPER_ADMIN },
];

interface SidebarProps {
	className?: string;
	onMenuClick?: () => void;
}

export default function Sidebar({ className, onMenuClick }: SidebarProps) {
	const location = useLocation();

	return (
		<aside className={cn('border-r bg-card text-card-foreground', className)}>
			<div className='flex h-full max-h-screen flex-col gap-2'>
				<div className='flex h-16 items-center border-b px-6 max-sm:justify-between'>
					<Link
						to='/dashboard'
						className='flex items-center gap-2 font-semibold'
					>
						{/* Puedes poner tu logo aquí */}
						<span className=''>Device Admin</span>
					</Link>

					<PanelLeftClose
						className='block md:hidden size-4 cursor-pointer'
						onClick={onMenuClick}
					/>
				</div>

				<div className='flex-1 overflow-y-auto py-2'>
					<nav className='grid items-start px-4 text-sm font-medium'>
						{navItems.map(({ href, label, icon: Icon, requiredRole }) => {
							const isActive = location.pathname === href;

							const link = (
								<Link
									key={href}
									to={href}
									className={cn(
										'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
										isActive && 'bg-muted text-primary',
									)}
								>
									<Icon className='h-4 w-4' />
									{label}
								</Link>
							);

							return requiredRole ? (
								<ProtectedContent
									key={href}
									requiredRole={requiredRole}
								>
									{link}
								</ProtectedContent>
							) : (
								link
							);
						})}
					</nav>
				</div>
			</div>
		</aside>
	);
}

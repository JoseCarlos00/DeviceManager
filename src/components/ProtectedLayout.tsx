import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { MaintenanceModeWatcher } from './MaintenanceModeWatcher'

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate(); // Inicializamos useNavigate
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

			// Cerrar sidebar automáticamente cuando cambie la ruta (útil para móviles)
			useEffect(() => {
				if (isSidebarOpen) {
					// Solo cierra el sidebar si está abierto
					setIsSidebarOpen(false);
				}
			}, [pathname, isSidebarOpen]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?error=session_expired');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
		<div className='flex min-h-screen w-full flex-col bg-muted/40 pb-4'>
			{/* Sidebar para móviles (overlay) y para desktop (fijo) */}
			<Sidebar
				onMenuClick={toggleSidebar}
				className={cn(
					'fixed inset-y-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
				)}
			/>

			<div className='flex flex-col lg:pl-64'>
				<Header onMenuClick={toggleSidebar} />
				<main className='flex-1 p-4 sm:px-6 sm:py-0'>
					<Outlet />
				</main>
			</div>
			{/* Overlay para cerrar el menú en móvil */}
			{isSidebarOpen && (
				<div
					onClick={toggleSidebar}
					className='fixed inset-0 z-40 bg-black/50 lg:hidden'
				/>
			)}

			<MaintenanceModeWatcher />
		</div>
	) : null;
}

import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Cambiado Navigate a useNavigate
import { useAuthStore } from '@/stores/authStore';
import AppHeader from '@/components/layout/Header';
import AppSidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { MaintenanceModeWatcher } from './MaintenanceModeWatcher'

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const navigate = useNavigate(); // Inicializamos useNavigate
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?error=session_expired');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
		<div className='flex min-h-screen w-full flex-col bg-muted/40'>
			{/* Sidebar para móviles (overlay) y para desktop (fijo) */}
			<AppSidebar
				onMenuClick={toggleSidebar}
				className={cn(
					'fixed inset-y-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
				)}
			/>

			<div className='flex flex-col lg:pl-64'>
				<AppHeader onMenuClick={toggleSidebar} />
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

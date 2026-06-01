import { useMemo, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'; 
import { useDeviceWebSocket } from '@/hooks/useDeviceWebSocket';
import { DeviceActionsProvider } from '@/contexts/DeviceActionsContext';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/lib/roles';
import { ProtectedContent } from '@/components/auth/protectedContent';
import ProtectedLayout from '@/components/ProtectedLayout';
import BroadcastPage from './pages/Broadcast';
import MaintenancePage from './pages/Maintenance';
import LoginPage from '@/pages/Login';
import DevicesPage from '@/pages/Devices';
import UsersPage from '@/pages/Users';
import ReportsPage from './pages/Reports';
import NotFoundPage from './pages/NotFound'

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // El socket vive aquí, en el nivel superior. Solo se conecta si hay autenticación.
  const {
    devices,
    isRefreshing,
    refresh,
    isConnected,
    sendMessage,
    sendPing,
    alarmActivate,
    sendBroadcastMessage,
    setBroadcastMaintenanceMode,
    checkForUpdateBroadcast
  } = useDeviceWebSocket(isAuthenticated);

  const value = useMemo(
    () => ({
      devices,
      isRefreshing,
      refresh,
      isConnected,
      SEND_MESSAGE: sendMessage,
      SEND_PING: sendPing,
      ALARM_ACTIVATE: alarmActivate,
      SEND_BROADCAST_MESSAGE: sendBroadcastMessage,
      SET_MAINTENANCE_MODE: setBroadcastMaintenanceMode,
      CHECK_FOR_UPDATE_BROADCAST: checkForUpdateBroadcast,
    }),
    [devices, isRefreshing, refresh, isConnected, sendMessage, sendPing, alarmActivate, sendBroadcastMessage, setBroadcastMaintenanceMode, checkForUpdateBroadcast],
  );

  return (
		<ThemeProvider
			defaultTheme='dark'
			storageKey='vite-ui-theme'
		>
			<DeviceActionsProvider value={value}>
				<Routes>
					<Route
						path='/login'
						element={<LoginPage />}
					/>

					<Route element={<ProtectedLayout />}>
						<Route
							path='/dashboard'
							element={<DevicesPage />}
						/>

						<Route
							path='/dashboard/users'
							element={
								<ProtectedContent
									requiredRole={UserRole.SUPER_ADMIN}
									fallback={
										<div className='flex items-center justify-center h-full pt-20 text-muted-foreground text-sm'>
											No tienes permisos para acceder a esta página.
										</div>
									}
								>
									<UsersPage />
								</ProtectedContent>
							}
						/>

						<Route
							path='/dashboard/broadcast'
							element={
								<ProtectedContent
									requiredRole={UserRole.ADMIN}
									fallback={
										<div className='flex items-center justify-center h-full pt-20 text-muted-foreground text-sm'>
											No tienes permisos para acceder a esta página.
										</div>
									}
								>
									<BroadcastPage />
								</ProtectedContent>
							}
						/>
						<Route
							path='/dashboard/maintenance'
							element={
								<ProtectedContent
									requiredRole={UserRole.ADMIN}
									fallback={
										<div className='flex items-center justify-center h-full pt-20 text-muted-foreground text-sm'>
											No tienes permisos para acceder a esta página.
										</div>
									}
								>
									<MaintenancePage />
								</ProtectedContent>
							}
						/>

						<Route
							path='/dashboard/reports'
							element={<ReportsPage />}
						/>
					</Route>

					<Route
						path='/'
						element={
							<Navigate
								to='/dashboard'
								replace
							/>
						}
					/>

					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</DeviceActionsProvider>
			<Toaster />
		</ThemeProvider>
	);
}

export default App

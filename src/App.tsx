import { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'; 
import  Login  from './pages/Login'
import ProtectedLayout from './components/ProtectedLayout';
import Devices from './pages/Devices'
import Administration from './pages/Administration'
import { useDeviceWebSocket } from '@/hooks/useDeviceWebSocket';
import { DeviceActionsProvider } from './contexts/DeviceActionsContext'
import { useAuthStore } from '@/stores/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();
  
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DeviceActionsProvider value={value}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedLayout />}>
            {/* Ya no necesitamos el layout intermedio DeviceActionsLayout */}
            <Route path="/dashboard" element={<Devices />} />
            <Route path="/dashboard/administration" element={<Administration />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DeviceActionsProvider>
      <Toaster />
    </ThemeProvider>
  )
}

export default App

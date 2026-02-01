import { useMemo } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'; 
import  Login  from './pages/Login'
import ProtectedLayout from './components/ProtectedLayout';
import Devices from './pages/Devices'
import Administration from './pages/Administration'
import { useDeviceWebSocket } from '@/hooks/useDeviceWebSocket';
import { DeviceActionsProvider } from './contexts/DeviceActionsContext'

// Layout unificado para inicializar el socket y el provider una sola vez
function DeviceActionsLayout() {
  const {
    isConnected,
    sendMessage,
    sendPing,
    alarmActivate,
    sendBroadcastMessage,
    setBroadcastMaintenanceMode,
    checkForUpdateBroadcast
  } = useDeviceWebSocket();

  const value = useMemo(
    () => ({
      isConnected,
      SEND_MESSAGE: sendMessage,
      SEND_PING: sendPing,
      ALARM_ACTIVATE: alarmActivate,
      SEND_BROADCAST_MESSAGE: sendBroadcastMessage,
      SET_MAINTENANCE_MODE: setBroadcastMaintenanceMode,
      CHECK_FOR_UPDATE_BROADCAST: checkForUpdateBroadcast,
    }),
    [isConnected, sendMessage, sendPing, alarmActivate, sendBroadcastMessage, setBroadcastMaintenanceMode, checkForUpdateBroadcast],
  );

  return (
    <DeviceActionsProvider value={value}>
      <Outlet />
    </DeviceActionsProvider>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route element={<DeviceActionsLayout />}>
            <Route path="/dashboard" element={<Devices />} />
            <Route path="/dashboard/administration" element={<Administration />} />
          </Route>
        </Route>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}

export default App

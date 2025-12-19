import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import  Login  from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedLayout from './components/ProtectedLayout';
import Devices from './pages/Devices'
import { Toaster } from '@/components/ui/sonner'; 

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/devices" element={<Devices />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}

export default App

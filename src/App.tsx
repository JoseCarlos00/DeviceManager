import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'; 
import  Login  from './pages/Login'
import ProtectedLayout from './components/ProtectedLayout';
import Devices from './pages/Devices'
import Administration from './pages/Administration'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Devices />} />
          <Route path="/dashboard/administration" element={<Administration />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}

export default App

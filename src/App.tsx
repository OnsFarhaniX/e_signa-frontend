import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import InvoicesPage from './pages/InvoicesPage'
import ClientsPage from './pages/ClientsPage'
import SignaturesPage from './pages/SignaturesPage'
import SettingsPage from './pages/SettingsPage'
import CreateInvoicePage from './pages/CreateInvoicePage'
import AdminPage from './pages/AdminPage'
import TemplatesPage from './pages/TemplatesPage'

// Protection des routes
const ProtectedRoute = ({ children, adminOnly = false }: { children: any, adminOnly?: boolean }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) return <Navigate to="/login" />
  if (adminOnly && role !== 'ADMIN') return <Navigate to="/dashboard" />
  return children
}

const UserRoute = ({ children }: { children: any }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) return <Navigate to="/login" />
  if (role === 'ADMIN') return <Navigate to="/dashboard" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Common — Admin + User */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />

        {/* User only */}
        <Route path="/invoices" element={
          <UserRoute><InvoicesPage /></UserRoute>
        } />
        <Route path="/invoices/new" element={
          <UserRoute><CreateInvoicePage /></UserRoute>
        } />
        <Route path="/clients" element={
          <UserRoute><ClientsPage /></UserRoute>
        } />
        <Route path="/templates" element={
          <UserRoute><TemplatesPage /></UserRoute>
        } />
        <Route path="/signatures" element={
          <UserRoute><SignaturesPage /></UserRoute>
        } />

        {/* Admin only */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute adminOnly><SettingsPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
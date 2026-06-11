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

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  return token && role === 'ADMIN' ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard"    element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/invoices"     element={<PrivateRoute><InvoicesPage /></PrivateRoute>} />
        <Route path="/invoices/new" element={<PrivateRoute><CreateInvoicePage /></PrivateRoute>} />
        <Route path="/clients"      element={<PrivateRoute><ClientsPage /></PrivateRoute>} />
        <Route path="/templates"    element={<PrivateRoute><TemplatesPage /></PrivateRoute>} />
        <Route path="/signatures"   element={<PrivateRoute><SignaturesPage /></PrivateRoute>} />

        <Route path="/admin"    element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
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

const token = () => localStorage.getItem('token')
const role = () => localStorage.getItem('role')

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={token() ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/invoices" element={token() ? <InvoicesPage /> : <Navigate to="/login" />} />
        <Route path="/invoices/new" element={token() ? <CreateInvoicePage /> : <Navigate to="/login" />} />
        <Route path="/clients" element={token() ? <ClientsPage /> : <Navigate to="/login" />} />
        <Route path="/templates" element={token() ? <TemplatesPage /> : <Navigate to="/login" />} />
        <Route path="/signatures" element={token() ? <SignaturesPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={token() && role() === 'ADMIN' ? <AdminPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={token() && role() === 'ADMIN' ? <SettingsPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
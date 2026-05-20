import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import InvoicesPage from './pages/InvoicesPage'
import ClientsPage from './pages/ClientsPage'
import SignaturesPage from './pages/SignaturesPage'
import SettingsPage from './pages/SettingsPage'
import CreateInvoicePage from './pages/CreateInvoicePage'
import TemplatesPage from './pages/TemplatesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoices/new" element={<CreateInvoicePage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/signatures" element={<SignaturesPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const login = async (email: string, password: string) => {
  const response = await API.post('/api/auth/login', { email, password })
  return response.data
}
export const register = async (data: object) => {
  const response = await API.post('/api/auth/register', data)
  return response.data
}

// Clients
export const getClients = () => API.get('/api/clients')
export const createClient = (data: object) => API.post('/api/clients', data)
export const updateClient = (id: string, data: object) => API.put(`/api/clients/${id}`, data)
export const deleteClient = (id: string) => API.delete(`/api/clients/${id}`)

// Invoices
export const getInvoices = () => API.get('/api/invoices')
export const getInvoiceById = (id: string) => API.get(`/api/invoices/${id}`)
export const createInvoice = (data: object) => API.post('/api/invoices', data)
export const updateInvoice = (id: string, data: object) => API.put(`/api/invoices/${id}`, data)
export const deleteInvoice = (id: string) => API.delete(`/api/invoices/${id}`)
export const getInvoicesByStatus = (status: string) => API.get(`/api/invoices/status/${status}`)
export const downloadInvoicePDF = (id: string) => API.get(`/api/invoices/${id}/pdf`, { responseType: 'blob' })
export const submitToTNN = (id: string) => API.post(`/api/invoices/${id}/submit-tnn`)

// Signature Keys
export const getSignatureKeys = () => API.get('/api/signature/keys')
export const getActiveKey = () => API.get('/api/signature/keys/active')
export const generateKey = (data: object) => API.post('/api/signature/keys/generate', data)
export const revokeKey = (id: string) => API.post(`/api/signature/keys/${id}/revoke`)
export const signInvoice = (id: string, passphrase: string, signatureKeyId: string) =>
  API.post(`/api/signature/invoices/${id}/sign`, { passphrase, signatureKeyId })

// Templates
export const getTemplates = () => API.get('/api/templates')
export const getTemplateById = (id: string) => API.get(`/api/templates/${id}`)
export const getDefaultTemplate = () => API.get('/api/templates/default')
export const createTemplate = (data: object) => API.post('/api/templates', data)
export const updateTemplate = (id: string, data: object) => API.put(`/api/templates/${id}`, data)
export const deleteTemplate = (id: string) => API.delete(`/api/templates/${id}`)
export const setDefaultTemplate = (id: string) => API.post(`/api/templates/${id}/set-default`)

// Company Settings
export const getCompanySettings = () => API.get('/api/settings')
export const saveCompanySettings = (data: object) => API.post('/api/settings', data)
export const updateCompanySettings = (data: object) => API.put('/api/settings', data)

// Admin - Users
export const getUsers = () => API.get('/api/admin/users')



export default API
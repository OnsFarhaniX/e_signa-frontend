import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080',
})

// Ajoute le token automatiquement
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
export const deleteInvoice = (id: string) => API.delete(`/api/invoices/${id}`)
export const signInvoice = (id: string, passphrase: string) =>
  API.post(`/api/signature/invoices/${id}/sign`, { passphrase })
// Download PDF
export const downloadInvoicePDF = (id: string) =>
  API.get(`/api/invoices/${id}/pdf`, { responseType: 'blob' })

// Signature Keys
export const getSignatureKeys = () => API.get('/api/signature/keys')
export const generateKey = (data: object) => API.post('/api/signature/keys/generate', data)
export const revokeKey = (id: string) => API.post(`/api/signature/keys/${id}/revoke`)

// Admin
export const getUsers = () => API.get('/api/auth/users').catch(() => ({ data: [] }))
export const createUser = (data: object) => API.post('/api/auth/register', data)

export default API
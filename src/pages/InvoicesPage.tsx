import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { getInvoices, deleteInvoice, downloadInvoicePDF } from '../api/auth'

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT:           { label: 'Draft',        color: 'bg-gray-100 text-gray-600' },
  SIGNED:          { label: 'Signed',       color: 'bg-green-100 text-green-700' },
  SENT_TO_TNN:     { label: 'Sent to TNN',  color: 'bg-purple-100 text-purple-700' },
  ACCEPTED_BY_TNN: { label: 'Accepted',     color: 'bg-blue-100 text-blue-700' },
  REJECTED_BY_TNN: { label: 'Rejected',     color: 'bg-red-100 text-red-700' },
  PAID:            { label: 'Paid',         color: 'bg-green-200 text-green-800' },
  CANCELLED:       { label: 'Cancelled',    color: 'bg-gray-200 text-gray-500' },
}

function InvoicesPage() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => { fetchInvoices() }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const res = await getInvoices()
      setInvoices(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Error loading invoices:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this invoice?')) return
    try {
      await deleteInvoice(id)
      fetchInvoices()
    } catch (err) {
      alert('Error deleting invoice')
    }
  }

  const handleDownloadPDF = async (id: string, invoiceNumber: string) => {
    try {
      setDownloading(id)
      const res = await downloadInvoicePDF(id)
      // Crée un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${invoiceNumber}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Error downloading PDF')
    } finally {
      setDownloading(null)
    }
  }

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      inv.client?.name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'ALL' || inv.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Invoices</h2>
            <p className="text-gray-500">Manage your invoices</p>
          </div>
          <button
            onClick={() => navigate('/invoices/new')}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + New Invoice
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SIGNED">Signed</option>
            <option value="SENT_TO_TNN">Sent to TNN</option>
            <option value="ACCEPTED_BY_TNN">Accepted</option>
            <option value="REJECTED_BY_TNN">Rejected</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            {filtered.length} invoice(s)
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Number</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  filtered.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-blue-600">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {invoice.client?.name || '-'}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {invoice.totalAmount} {invoice.currency || 'TND'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(invoice.issueDate).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[invoice.status]?.color}`}>
                          {statusConfig[invoice.status]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          {/* Download PDF */}
                          <button
                            onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}
                            disabled={downloading === invoice.id}
                            className="text-blue-600 hover:underline text-xs disabled:opacity-50"
                          >
                            {downloading === invoice.id ? 'Downloading...' : 'PDF'}
                          </button>

                          {/* Delete (only DRAFT) */}
                          {invoice.status === 'DRAFT' && (
                            <button
                              onClick={() => handleDelete(invoice.id)}
                              className="text-red-500 hover:underline text-xs"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  )
}

export default InvoicesPage
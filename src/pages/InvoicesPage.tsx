import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { getInvoices, deleteInvoice, downloadInvoicePDF, signInvoice, submitToTNN, getActiveKey } from '../api/auth'

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT:           { label: 'Draft',       color: 'bg-gray-100 text-gray-600' },
  SIGNED:          { label: 'Signed',      color: 'bg-green-100 text-green-700' },
  SENT_TO_TNN:     { label: 'Sent to TNN', color: 'bg-purple-100 text-purple-700' },
  ACCEPTED_BY_TNN: { label: 'Accepted',    color: 'bg-blue-100 text-blue-700' },
  REJECTED_BY_TNN: { label: 'Rejected',    color: 'bg-red-100 text-red-700' },
  PAID:            { label: 'Paid',        color: 'bg-green-200 text-green-800' },
  CANCELLED:       { label: 'Cancelled',   color: 'bg-gray-200 text-gray-500' },
}

function InvoicesPage() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [downloading, setDownloading] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [showSignModal, setShowSignModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [passphrase, setPassphrase] = useState('')
  const [signing, setSigning] = useState(false)
  const [signError, setSignError] = useState('')

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

  const handleSubmitTNN = async (id: string) => {
    if (!window.confirm('Submit this invoice to TNN?')) return
    try {
      setSubmitting(id)
      await submitToTNN(id)
      alert('Invoice submitted to TNN successfully!')
      fetchInvoices()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting to TNN')
    } finally {
      setSubmitting(null)
    }
  }

  const openSignModal = (invoice: any) => {
    setSelectedInvoice(invoice)
    setPassphrase('')
    setSignError('')
    setShowSignModal(true)
  }

  const handleSign = async () => {
  if (!passphrase) { setSignError('Passphrase is required'); return }
  try {
    setSigning(true)
    setSignError('')

    // Récupère la clé active
    const keyRes = await getActiveKey()
    const activeKeyId = keyRes.data?.id || keyRes.data?.data?.id

    if (!activeKeyId) {
      setSignError('No active signature key found. Please generate a key first.')
      return
    }

    // Signe avec keyId + passphrase
    await signInvoice(selectedInvoice.id, passphrase, activeKeyId)

    setShowSignModal(false)
    setPassphrase('')
    fetchInvoices()
    alert('Invoice signed successfully!')
  } catch (err: any) {
    setSignError(err.response?.data?.message || 'Invalid passphrase or signing failed')
  } finally {
    setSigning(false)
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">Invoices</span>
          </div>
          <button
            onClick={() => navigate('/invoices/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            + New Invoice
          </button>
        </div>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
            <p className="text-gray-500 text-sm mt-1">Manage your invoices</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
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
            <span className="text-sm text-gray-500 ml-auto">{filtered.length} invoice(s)</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Number</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Client</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Actions</th>
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
                        <td className="px-6 py-4 font-medium text-blue-600">{invoice.invoiceNumber}</td>
                        <td className="px-6 py-4 text-gray-600">{invoice.client?.name || '-'}</td>
                        <td className="px-6 py-4 font-medium">{invoice.totalAmount} {invoice.currency || 'TND'}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(invoice.issueDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[invoice.status]?.color}`}>
                            {statusConfig[invoice.status]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3 items-center">

                            {/* Sign — Draft only */}
                            {invoice.status === 'DRAFT' && (
                              <button
                                onClick={() => openSignModal(invoice)}
                                className="text-green-600 hover:underline text-xs font-medium"
                              >
                                Sign
                              </button>
                            )}

                            {/* Submit to TNN — Signed only */}
                            {invoice.status === 'SIGNED' && (
                              <button
                                onClick={() => handleSubmitTNN(invoice.id)}
                                disabled={submitting === invoice.id}
                                className="text-purple-600 hover:underline text-xs font-medium disabled:opacity-50"
                              >
                                {submitting === invoice.id ? 'Submitting...' : 'Send TNN'}
                              </button>
                            )}

                            {/* PDF — Not draft */}
                            {invoice.status !== 'DRAFT' && (
                              <button
                                onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}
                                disabled={downloading === invoice.id}
                                className="text-blue-600 hover:underline text-xs disabled:opacity-50"
                              >
                                {downloading === invoice.id ? 'Downloading...' : 'PDF'}
                              </button>
                            )}

                            {/* Delete — Draft only */}
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

      {/* Sign Modal */}
      {showSignModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Sign Invoice</h3>
              <button onClick={() => setShowSignModal(false)} className="text-gray-400 text-2xl">x</button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Invoice: <span className="font-semibold">{selectedInvoice.invoiceNumber}</span></p>
              <p className="text-sm text-gray-600 mt-1">Client: <span className="font-semibold">{selectedInvoice.client?.name}</span></p>
              <p className="text-sm text-gray-600 mt-1">Amount: <span className="font-semibold">{selectedInvoice.totalAmount} TND</span></p>
            </div>
            
            {signError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{signError}</div>
            )}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Signing key passphrase</label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter your passphrase"
                onKeyDown={(e) => e.key === 'Enter' && handleSign()}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            

</div>
            <div className="flex gap-3">
              <button onClick={() => setShowSignModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSign} disabled={signing}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50">
                {signing ? 'Signing...' : 'Sign Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default InvoicesPage
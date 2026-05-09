import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { getInvoices, getClients, getSignatureKeys } from '../api/auth'

function DashboardPage() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [keys, setKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [invRes, clientRes, keyRes] = await Promise.all([
        getInvoices(),
        getClients(),
        getSignatureKeys()
      ])
      setInvoices(Array.isArray(invRes.data) ? invRes.data : [])
      setClients(Array.isArray(clientRes.data) ? clientRes.data : [])
      setKeys(Array.isArray(keyRes.data) ? keyRes.data : [])
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Stats calculées
  const totalInvoices = invoices.length
  const signedInvoices = invoices.filter(i => i.status === 'SIGNED').length
  const draftInvoices = invoices.filter(i => i.status === 'DRAFT').length
  const sentToTNN = invoices.filter(i => i.status === 'SENT_TO_TNN').length
  const totalClients = clients.length
  const activeKeys = keys.filter(k => k.isActive).length

  // Dernières factures
  const latestInvoices = invoices.slice(0, 5)

  const statusConfig: Record<string, { label: string; color: string }> = {
    DRAFT:           { label: 'Draft',       color: 'bg-gray-100 text-gray-600' },
    SIGNED:          { label: 'Signed',      color: 'bg-green-100 text-green-700' },
    SENT_TO_TNN:     { label: 'Sent to TNN', color: 'bg-purple-100 text-purple-700' },
    ACCEPTED_BY_TNN: { label: 'Accepted',    color: 'bg-blue-100 text-blue-700' },
    REJECTED_BY_TNN: { label: 'Rejected',    color: 'bg-red-100 text-red-700' },
    PAID:            { label: 'Paid',        color: 'bg-green-200 text-green-800' },
    CANCELLED:       { label: 'Cancelled',   color: 'bg-gray-200 text-gray-500' },
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-500 mt-1">Welcome to your E-Signature platform</p>
          </div>

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Total Invoices
              </p>
              
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalInvoices}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Draft
              </p>
              
            </div>
            <p className="text-3xl font-bold text-gray-600">{draftInvoices}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Signed
              </p>
            </div>
            <p className="text-3xl font-bold text-black-600">{signedInvoices}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Sent TNN
              </p>
            </div>
            <p className="text-3xl font-bold text-black-600">{sentToTNN}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Clients
              </p>
            </div>
            <p className="text-3xl font-bold text-black-600">{totalClients}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Active Keys
              </p>

            </div>
            <p className="text-3xl font-bold text-black-600">{activeKeys}</p>
          </div>

        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Latest Invoices — 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Latest Invoices</h3>
              <button
                onClick={() => navigate('/invoices')}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                View all
              </button>
            </div>

            {latestInvoices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No invoices yet</p>
                
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Number</th>
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {latestInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => navigate('/invoices')}
                    >
                      <td className="py-3 font-medium text-blue-600">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="py-3 text-gray-600">
                        {invoice.client?.name || '-'}
                      </td>
                      <td className="py-3 font-medium text-gray-900">
                        {invoice.totalAmount} {invoice.currency || 'TND'}
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(invoice.issueDate).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[invoice.status]?.color}`}>
                          {statusConfig[invoice.status]?.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Right Column — 1/3 width */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/invoices/new')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition text-sm font-medium"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                  New Invoice
                </button>
                <button
                  onClick={() => navigate('/clients')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition text-sm font-medium"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                  New Client
                </button>
                <button
                  onClick={() => navigate('/signatures')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition text-sm font-medium"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">K</span>
                  </div>
                  Generate Key
                </button>
              </div>
            </div>

            {/* Invoice Status Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Status</h3>
              <div className="space-y-3">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Draft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-400 rounded-full"
                        style={{ width: totalInvoices > 0 ? `${(draftInvoices / totalInvoices) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-4">{draftInvoices}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Signed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: totalInvoices > 0 ? `${(signedInvoices / totalInvoices) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-4">{signedInvoices}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Sent to TNN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: totalInvoices > 0 ? `${(sentToTNN / totalInvoices) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-4">{sentToTNN}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}

export default DashboardPage
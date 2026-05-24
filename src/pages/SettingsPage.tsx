import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getCompanySettings, saveCompanySettings, updateCompanySettings } from '../api/auth'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [hasSettings, setHasSettings] = useState(false)

  const [company, setCompany] = useState({
    companyName: '',
    taxId: '',
    address: '',
    phone: '',
    email: '',
    defaultCurrency: 'TND',
    defaultVatRate: 19,
    invoicePrefix: 'INV',
    invoiceNumberDigits: 5
  })

  const [smtp, setSmtp] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: ''
  })

  const [tnn, setTnn] = useState({
    tnnApiKey: '',
    tnnEndpointUrl: '',
    tnnCompanyId: ''
  })

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await getCompanySettings()
      const data = res.data
      if (data) {
        setHasSettings(true)
        setCompany({
          companyName: data.companyName || '',
          taxId: data.taxId || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          defaultCurrency: data.defaultCurrency || 'TND',
          defaultVatRate: data.defaultVatRate || 19,
          invoicePrefix: data.invoicePrefix || 'INV',
          invoiceNumberDigits: data.invoiceNumberDigits || 5
        })
        setSmtp({
          smtpHost: data.smtpHost || '',
          smtpPort: data.smtpPort || 587,
          smtpUsername: data.smtpUsername || '',
          smtpPassword: ''
        })
        setTnn({
          tnnApiKey: '',
          tnnEndpointUrl: data.tnnEndpointUrl || '',
          tnnCompanyId: data.tnnCompanyId || ''
        })
      }
    } catch (err) {
      console.log('No settings found yet')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const data = { ...company, ...smtp, ...tnn }
      if (hasSettings) {
        await updateCompanySettings(data)
      } else {
        await saveCompanySettings(data)
        setHasSettings(true)
      }
      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'company', label: 'Company' },
    { id: 'email', label: 'Email SMTP' },
    { id: 'tnn', label: 'TNN Service' },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading settings...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">Settings</span>
          </div>
        </div>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-500 text-sm mt-1">Configure your platform</p>
          </div>

          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm border border-green-200">
              {success}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-lg font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input type="text" value={company.companyName}
                      onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                      placeholder="Company Name "
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID *</label>
                    <input type="text" value={company.taxId}
                      onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
                      placeholder="Tax ID "
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    placeholder="Address" rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" value={company.phone}
                      onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                      placeholder="+216 xx xxx xxx"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={company.email}
                      onChange={(e) => setCompany({ ...company, email: e.target.value })}
                      placeholder="Email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select value={company.defaultCurrency}
                      onChange={(e) => setCompany({ ...company, defaultCurrency: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="TND">TND</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Prefix</label>
                    <input type="text" value={company.invoicePrefix}
                      onChange={(e) => setCompany({ ...company, invoicePrefix: e.target.value })}
                      placeholder="INV"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default VAT %</label>
                    <input type="number" value={company.defaultVatRate}
                      onChange={(e) => setCompany({ ...company, defaultVatRate: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Email SMTP Configuration</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                    <input type="text" value={smtp.smtpHost}
                      onChange={(e) => setSmtp({ ...smtp, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                    <input type="number" value={smtp.smtpPort}
                      onChange={(e) => setSmtp({ ...smtp, smtpPort: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input type="text" value={smtp.smtpUsername}
                    onChange={(e) => setSmtp({ ...smtp, smtpUsername: e.target.value })}
                    placeholder="your-email@gmail.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" value={smtp.smtpPassword}
                    onChange={(e) => setSmtp({ ...smtp, smtpPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* TNN Tab */}
          {activeTab === 'tnn' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">TNN Service Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TNN API Key</label>
                  <input type="password" value={tnn.tnnApiKey}
                    onChange={(e) => setTnn({ ...tnn, tnnApiKey: e.target.value })}
                    placeholder="Your TNN API key"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                  <input type="text" value={tnn.tnnEndpointUrl}
                    onChange={(e) => setTnn({ ...tnn, tnnEndpointUrl: e.target.value })}
                    placeholder="https://api.tnn.tn/v1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
                  <input type="text" value={tnn.tnnCompanyId}
                    onChange={(e) => setTnn({ ...tnn, tnnCompanyId: e.target.value })}
                    placeholder="Your TNN company ID"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default SettingsPage
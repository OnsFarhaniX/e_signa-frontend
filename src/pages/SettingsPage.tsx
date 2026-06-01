import { useState } from 'react'
import Sidebar from '../components/Sidebar'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')

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

  // NOTE: /api/settings endpoint does not exist in the backend.
  // Settings are stored directly in the database (company_settings table).
  // This page is display-only. The admin must insert settings via pgAdmin or SQL.
  const handleSave = () => {
    alert(
      'Settings are managed directly in the database.\n\n' +
      'Please use pgAdmin to update the company_settings table.\n\n' +
      'Your administrator can run the SQL INSERT or UPDATE command.'
    )
  }

  const tabs = [
    { id: 'company', label: 'Company' },
    { id: 'email', label: 'Email SMTP' },
    { id: 'tnn', label: 'TNN Service' },
  ]

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
            <p className="text-gray-500 text-sm mt-1">Platform configuration reference</p>
          </div>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 text-sm text-blue-700">
            These settings are configured directly in the database by the administrator.
            Contact your DBA to update company_settings via pgAdmin or SQL.
          </div>

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input type="text" value={company.companyName}
                      onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                      placeholder="Company Name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                    <input type="text" value={company.taxId}
                      onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
                      placeholder="Tax ID"
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
                <button onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                  View Instructions
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
                <button onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                  View Instructions
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
                <button onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                  View Instructions
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
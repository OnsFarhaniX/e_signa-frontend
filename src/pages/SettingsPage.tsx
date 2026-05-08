import { useState } from 'react'
import Sidebar from '../components/Sidebar'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')
  const [company, setCompany] = useState({ name: '', taxId: '', address: '', phone: '', email: '' })
  const [smtp, setSmtp] = useState({ host: '', port: '587', username: '', password: '' })
  const [tnn, setTnn] = useState({ apiKey: '', endpoint: '', companyId: '', environment: 'test' })

  const tabs = [
    { id: 'company', label: ' Company' },
    { id: 'email', label: ' Email SMTP' },
    { id: 'tnn', label: ' TNN Service' },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <p className="text-gray-500">Configure your platform</p>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'company' && (
          <div className="bg-white rounded-xl shadow p-8 max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  placeholder="e.g. My Company LLC"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                <input type="text" value={company.taxId}
                  onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
                  placeholder="e.g. 1234567ABC"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={company.address}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  placeholder="Full address" rows={3}
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
                    placeholder="contact@company.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                 Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="bg-white rounded-xl shadow p-8 max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Email SMTP Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                  <input type="text" value={smtp.host}
                    onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                  <input type="text" value={smtp.port}
                    onChange={(e) => setSmtp({ ...smtp, port: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={smtp.username}
                  onChange={(e) => setSmtp({ ...smtp, username: e.target.value })}
                  placeholder="your-email@gmail.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={smtp.password}
                  onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                  Save
                </button>
                <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 font-semibold">
                   Test Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tnn' && (
          <div className="bg-white rounded-xl shadow p-8 max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">TNN Service Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                <select value={tnn.environment}
                  onChange={(e) => setTnn({ ...tnn, environment: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="test">Test</option>
                  <option value="production">Production</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TNN API Key</label>
                <input type="password" value={tnn.apiKey}
                  onChange={(e) => setTnn({ ...tnn, apiKey: e.target.value })}
                  placeholder="Your TNN API key"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                <input type="text" value={tnn.endpoint}
                  onChange={(e) => setTnn({ ...tnn, endpoint: e.target.value })}
                  placeholder="https://api.tnn.tn/v1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
                <input type="text" value={tnn.companyId}
                  onChange={(e) => setTnn({ ...tnn, companyId: e.target.value })}
                  placeholder="Your company ID"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                   Save
                </button>
                <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 font-semibold">
                   Test Connection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SettingsPage
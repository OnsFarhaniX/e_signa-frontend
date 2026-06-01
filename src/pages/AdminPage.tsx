import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { register } from '../api/auth'

function AdminPage() {
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('All fields are required')
      setSuccess('')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      setSuccess('')
      return
    }

    try {
      // Uses POST /api/auth/register — exists in backend
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })

      setSuccess(`User ${form.firstName} ${form.lastName} created successfully`)
      setError('')
      setForm({ firstName: '', lastName: '', email: '', password: '' })
      setShowModal(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating user')
      setSuccess('')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">User Management</span>
          </div>
          <button
            onClick={() => { setShowModal(true); setError(''); setSuccess('') }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            + New User
          </button>
        </div>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-500 text-sm mt-1">Create new platform users</p>
          </div>

          {/* Success message */}
          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm border border-green-200">
              {success}
            </div>
          )}

          {/* Info box */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-xl mx-auto mt-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl font-bold">U</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Users</h3>
            <p className="text-gray-500 text-sm mb-6">
              As an administrator, you can create new users. All new users are assigned the USER role by default.
              User listing is not available in the current backend version.
            </p>
            <button
              onClick={() => { setShowModal(true); setError(''); setSuccess('') }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              + Create New User
            </button>
          </div>
        </main>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New User</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password * (min. 8 characters)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
                New users are automatically assigned the USER role.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
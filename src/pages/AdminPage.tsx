import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { register, getUsers } from '../api/auth'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

function AdminPage() {
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const res = await getUsers()
      setUsers(res.data)
    } catch (err) {
      console.error('Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

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
      fetchUsers() // Rafraîchir la liste
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
            <span className="text-gray-900 font-medium">User List</span>
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
            <h2 className="text-2xl font-bold text-gray-900">User List</h2>
            <p className="text-gray-500 text-sm mt-1">List of all  users</p>
          </div>

          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm border border-green-200">
              {success}
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loadingUsers ? (
              <div className="p-8 text-center text-gray-400 text-sm">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No users found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Role</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
                  placeholder="email"
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
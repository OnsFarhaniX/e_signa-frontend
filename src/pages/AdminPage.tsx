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
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password
    ) {
      setError('All fields are required')
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

      setSuccess('User created successfully')
      setError('')

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      })

      setShowModal(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating user')
      setSuccess('')
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Admin Panel
            </h2>
            <p className="text-gray-500">
              Create users using the authentication API
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            + New User
          </button>
        </div>

        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">
            User Creation Only
          </h3>

          <p className="text-gray-500">
            This backend supports only registration. User listing is not available.
          </p>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Create User</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="First Name"
                className="w-full border p-2 rounded"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />

              <input
                placeholder="Last Name"
                className="w-full border p-2 rounded"
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border p-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreate}
                  className="flex-1 bg-blue-600 text-white p-2 rounded"
                >
                  Create
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
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getSignatureKeys, generateKey, revokeKey } from '../api/auth'

function SignaturesPage() {
  const [keys, setKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => { fetchKeys() }, [])

  const fetchKeys = async () => {
    try {
      setLoading(true)
      const res = await getSignatureKeys()
      setKeys(res.data?.data || res.data || [])
    } catch (err) {
      console.error('Error loading keys:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!keyName || !passphrase || !confirmPass) {
      setError('All fields are required'); return
    }
    if (passphrase !== confirmPass) {
      setError('Passphrases do not match'); return
    }
    if (passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters'); return
    }
    try {
      setGenerating(true)
      setError('')
      await generateKey({ keyName, passphrase })
      setShowModal(false)
      setKeyName(''); setPassphrase(''); setConfirmPass('')
      fetchKeys()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error generating key')
    } finally {
      setGenerating(false)
    }
  }

  const handleRevoke = async (id: string) => {
    if (!window.confirm('Revoke this key?')) return
    try {
      await revokeKey(id)
      fetchKeys()
    } catch (err) {
      alert('Error revoking key')
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Signature Keys</h2>
            <p className="text-gray-500">Manage your cryptographic keys</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            + Generate Key
          </button>
        </div>

        

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        ) : keys.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
            No signature keys found. Generate your first key!
          </div>
        ) : (
          <div className="space-y-4">
            {keys.map((key) => (
              <div key={key.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-2xl"></div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-800">{key.keyName}</h3>
                        {key.isActive ? (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Active</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">Inactive</span>
                        )}
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-500">
                        <p> Algorithm: <span className="font-medium text-gray-700">{key.algorithm}</span></p>
                        <p> Created: <span className="font-medium text-gray-700">
                          {new Date(key.createdAt).toLocaleDateString('en-GB')}
                        </span></p>
                        {key.expiresAt && (
                          <p> Expires: <span className="font-medium text-gray-700">
                            {new Date(key.expiresAt).toLocaleDateString('en-GB')}
                          </span></p>
                        )}
                      </div>
                    </div>
                  </div>
                  {key.isActive && (
                    <button onClick={() => handleRevoke(key.id)}
                      className="text-sm bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-100">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Generate Key</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
                <input type="text" value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder=" Key name "
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passphrase *</label>
                <input type="password" value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Passphrase</label>
                <input type="password" value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repeat passphrase"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleGenerate} disabled={generating}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
                  {generating ? 'Generating...' : 'Generate '}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignaturesPage
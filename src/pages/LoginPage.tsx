import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      const token = data.accessToken || data.token || data.data?.accessToken
      if (!token) { setError('Authentication failed'); return }
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch (err: any) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE — Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-12 py-12 bg-white">

        {/* Logo */}
        <div className="mb-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">E-Signature</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
        <p className="text-gray-500 mb-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Create new account
          </Link>
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              />
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '*' : 'show'}
              </button>
            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-base"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

        </form>

      
      </div>

      {/* RIGHT SIDE — Visual */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 flex-col items-center justify-center px-12 relative overflow-hidden">

        
        

       

        {/* Content */}
        <div className="text-center text-white z-10 max-w-md">
          <div className="w-20 h-20 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <span className="text-4xl font-bold text-white">ES</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Welcome to <br /> our platform
          </h1>
          <p className="text-blue-300 text-lg leading-relaxed">
            Easily manage your electronic signatures and invoices. Sign, send and track your documents securely.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-3 text-left">
            <div className="flex items-center gap-3 text-blue-100">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>Digital signature with RSA-2048 encryption</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>Automatic invoice management</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>Direct integration with TNN</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default LoginPage
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SEO from '../components/SEO'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <SEO title="Sign In" noindex />
      {/* Left - Image */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen">
        <img
          src="/auth-peony.png"
          alt="Peony"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FBF8F2]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <svg
              className="w-12 h-12 text-[#8B3E7A]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-stone-800 text-center mb-4">
            Petals for Her
          </h1>
          <div className="w-12 h-px bg-stone-300 mx-auto mb-8" />

          <h2 className="font-sans text-xl font-semibold text-stone-800 text-center mb-1">
            Welcome Back
          </h2>
          <p className="text-stone-600 text-sm text-center mb-6">
            Sign in to access your boutique flower collection.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="evelyn@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4A5A5]/50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-stone-700">
                  Password
                </label>
                <a href="#" className="text-sm text-[#AA769E] hover:underline">
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4A5A5]/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-stone-300 text-[#4F6D65] focus:ring-[#4F6D65]"
              />
              <label htmlFor="remember" className="text-sm text-stone-700">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4F6D65] text-white font-medium rounded-lg hover:bg-[#3d5a52] transition disabled:opacity-60 uppercase text-sm tracking-wide"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-stone-600 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-[#8B3E7A] font-medium hover:underline">
              Sign Up
            </Link>
          </p>

          <div className="flex justify-center gap-1.5 mt-8">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-stone-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-stone-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

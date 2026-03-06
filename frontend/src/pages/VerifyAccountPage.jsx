import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'

function VerifyAccountPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setToken, loadUser } = useAuth()
  const email = searchParams.get('email') || ''

  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!email) {
      navigate('/register')
    }
  }, [email, navigate])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    setError('')
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]
    pasted.split('').forEach((char, i) => { newCode[i] = char })
    for (let i = pasted.length; i < 6; i++) newCode[i] = ''
    setCode(newCode)
    setError('')
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const fullCode = code.join('')

  const handleVerify = async (e) => {
    e.preventDefault()
    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit code')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/v1/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        const token = res.headers.get('Authorization')?.replace('Bearer ', '') || data.token
        if (token) {
          setToken(token)
          await loadUser()
        }
        navigate('/')
      } else {
        setError(data.error || 'Verification failed')
      }
    } catch {
      setError('Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async (e) => {
    e.preventDefault()
    setResendLoading(true)
    setResendSuccess(false)
    setError('')
    try {
      const res = await fetch('/api/v1/auth/resend_verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setResendSuccess(true)
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        setError(data.error || 'Could not resend code')
      }
    } catch {
      setError('Could not resend code')
    } finally {
      setResendLoading(false)
    }
  }

  if (!email) return null

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Card header - deep magenta */}
            <div className="relative bg-[#8B3E7A] px-6 py-5 flex items-center gap-4 overflow-hidden">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-white">Verify Your Account</h1>
              <div className="absolute right-0 top-0 bottom-0 w-24 opacity-30">
                <svg className="w-full h-full text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
                </svg>
              </div>
            </div>

            {/* Card body */}
            <div className="p-6">
              <p className="text-stone-600 text-sm mb-6">
                We've sent a 6-digit verification code to your email address. Please enter it below to confirm your registration.
              </p>

              <form onSubmit={handleVerify} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
                )}
                {resendSuccess && (
                  <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">New code sent! Check your email.</div>
                )}

                <div className="flex gap-2 justify-center">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-lg font-semibold border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3E7A]/50 focus:border-[#8B3E7A]"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || fullCode.length !== 6}
                  className="w-full py-3 bg-[#8B3E7A] text-white font-medium rounded-lg hover:bg-[#7A3569] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>

                <p className="text-center text-sm text-stone-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-[#8B3E7A] font-medium hover:underline disabled:opacity-60"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Code'}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer links */}
      <footer className="py-6 text-center">
        <div className="flex justify-center gap-4 text-sm text-stone-500">
          <Link to="/privacy_policy" className="hover:text-stone-700 transition">Privacy Policy</Link>
          <span>|</span>
          <Link to="/terms" className="hover:text-stone-700 transition">Terms of Service</Link>
          <span>|</span>
          <Link to="/contact_us" className="hover:text-stone-700 transition">Help Center</Link>
        </div>
      </footer>
    </div>
  )
}

export default VerifyAccountPage

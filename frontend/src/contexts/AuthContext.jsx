import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'petals_jwt'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getToken = () => localStorage.getItem(TOKEN_KEY)

  const setToken = (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const token = getToken()
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
    const res = await fetch(url, { ...options, headers })
    const newToken = res.headers.get('Authorization')?.replace('Bearer ', '')
    if (newToken) setToken(newToken)
    return res
  }, [])

  const loadUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const res = await fetchWithAuth('/api/v1/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        setToken(null)
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [fetchWithAuth])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/v1/auth/sign_in', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ user: { email, password } }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || data.message || 'Login failed')
    const token = res.headers.get('Authorization')?.replace('Bearer ', '') || data.token
    if (token) setToken(token)
    await loadUser()
    return data
  }, [loadUser])

  const register = useCallback(async (fullName, email, password, passwordConfirmation) => {
    const res = await fetch('/api/v1/auth/sign_up', {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        user: { full_name: fullName, email, password, password_confirmation: passwordConfirmation },
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.errors?.[0] || data.error || 'Registration failed')
    if (data.needs_verification) {
      return { needs_verification: true, email: data.email }
    }
    const token = res.headers.get('Authorization')?.replace('Bearer ', '') || data.token
    if (token) setToken(token)
    await loadUser()
    return data
  }, [loadUser])

  const logout = useCallback(async () => {
    try {
      await fetchWithAuth('/api/v1/auth/sign_out', { method: 'DELETE' })
    } catch {
      /* ignore */
    }
    setToken(null)
    setUser(null)
  }, [fetchWithAuth])

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    fetchWithAuth,
    setToken,
    loadUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

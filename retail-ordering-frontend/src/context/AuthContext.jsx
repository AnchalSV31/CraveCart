// ─── AuthContext — integrated with retail-ordering backend ─────────────────
// Register now sends phone field.
// Backend returns plain JWT string on login (not JSON).
// ───────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const saved = localStorage.getItem('user')
    if (token && saved) {
      try { setUser(JSON.parse(saved)) } catch { }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    // credentials: { email, password, role }
    const payload = { username: credentials.email, password: credentials.password }
    const res = await authAPI.login(payload)
    const token = typeof res.data === 'string' ? res.data.trim() : res.data

    const claims = decodeJwt(token)
    const userData = {
      id: null,
      name: claims?.sub ?? credentials.email,
      email: credentials.email,
      username: claims?.sub ?? credentials.email,
      role: credentials.role ?? 'USER',
      phone: credentials.phone ?? null,
    }

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (data) => {
    // data from Register form: { name, email, password, role, phone }
    const payload = {
      username: data.email,   // use email as username
      email: data.email,
      password: data.password,
      role: data.role ?? 'USER',
      phone: data.phone ?? '',
    }
    await authAPI.register(payload)  // returns "User registered"

    // Auto-login and carry phone into user object
    const loggedIn = await login({ email: data.email, password: data.password, role: data.role })
    // Persist phone (not in JWT) into stored user
    const withPhone = { ...loggedIn, phone: data.phone ?? '' }
    localStorage.setItem('user', JSON.stringify(withPhone))
    setUser(withPhone)
    return withPhone
  }, [login])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, logout,
      isAdmin: user?.role === 'ADMIN',
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

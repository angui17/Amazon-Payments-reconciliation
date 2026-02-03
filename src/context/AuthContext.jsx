import React, { createContext, useState, useContext, useEffect } from 'react'
import { slLogin, slLogout } from '../api/base' 
const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedAuth = localStorage.getItem('amazonpay_auth')
    const savedUser = localStorage.getItem('amazonpay_user')

    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    // ✅ login real al Service Layer
    const payload = {
      UserName: username,
      Password: password,
      CompanyDB: 'SBO_COPA_LIVE'
    }

    const data = await slLogin(payload)

    // data normalmente trae SessionId, Version, SessionTimeout, etc.
    const userData = {
      name: username,
      companyDb: payload.CompanyDB,
      sessionId: data?.SessionId || null
    }

    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('amazonpay_auth', 'true')
    localStorage.setItem('amazonpay_user', JSON.stringify(userData))

    return userData
  }

  const logout = async () => {
    try { await slLogout() } catch { /* no bloquea */ }

    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('amazonpay_auth')
    localStorage.removeItem('amazonpay_user')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
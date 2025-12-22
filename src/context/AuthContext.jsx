import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Verificar sesión en localStorage al cargar
    const savedAuth = localStorage.getItem('amazonpay_auth')
    const savedUser = localStorage.getItem('amazonpay_user')
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
    }
    
    setLoading(false)
  }, [])

  const login = (username, password) => {
    // Simulación de autenticación
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
          const userData = {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@company.com',
            role: 'admin',
            avatar: 'JD'
          }
          
          setIsAuthenticated(true)
          setUser(userData)
          localStorage.setItem('amazonpay_auth', 'true')
          localStorage.setItem('amazonpay_user', JSON.stringify(userData))
          resolve(userData)
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 1000)
    })
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('amazonpay_auth')
    localStorage.removeItem('amazonpay_user')
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      loading,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}
// import React, { createContext, useState, useContext, useEffect } from 'react'
// import { slLogin, slLogout } from '../api/base' 
// const AuthContext = createContext()
// export const useAuth = () => useContext(AuthContext)

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [user, setUser] = useState(null)

//   useEffect(() => {
//     const savedAuth = localStorage.getItem('amazonpay_auth')
//     const savedUser = localStorage.getItem('amazonpay_user')

//     if (savedAuth === 'true' && savedUser) {
//       setIsAuthenticated(true)
//       setUser(JSON.parse(savedUser))
//     }
//     setLoading(false)
//   }, [])

//   const login = async (username, password) => {
//     // ✅ login real al Service Layer
//     const payload = {
//       UserName: username,
//       Password: password,
//       CompanyDB: 'SBO_COPA_LIVE'
//     }

//     const data = await slLogin(payload)

//     // data normalmente trae SessionId, Version, SessionTimeout, etc.
//     const userData = {
//       name: username,
//       companyDb: payload.CompanyDB,
//       sessionId: data?.SessionId || null
//     }

//     setIsAuthenticated(true)
//     setUser(userData)
//     localStorage.setItem('amazonpay_auth', 'true')
//     localStorage.setItem('amazonpay_user', JSON.stringify(userData))

//     return userData
//   }

//   const logout = async () => {
//     try { await slLogout() } catch { /* no bloquea */ }

//     setIsAuthenticated(false)
//     setUser(null)
//     localStorage.removeItem('amazonpay_auth')
//     localStorage.removeItem('amazonpay_user')
//   }

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { slLogin, slLogout } from '../api/base'
import { getMyProfile, upsertMyProfile } from '../api/userProfile'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

/**
 * LocalStorage keys
 */
const LS_AUTH = 'amazonpay_auth'
const LS_USER = 'amazonpay_user'

function safeTrim(v) {
  return typeof v === 'string' ? v.trim() : ''
}

function buildInitials(name) {
  const base = safeTrim(name)
  if (!base) return 'U'
  const parts = base.split(/\s+/).filter(Boolean)
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
  return initials || 'U'
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // user = info mínimo para el portal
  const [user, setUser] = useState(null)

  // profile = info editable (portal only)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  // ====== Boot: restore session from localStorage ======
  useEffect(() => {
    const savedAuth = localStorage.getItem(LS_AUTH)
    const savedUser = localStorage.getItem(LS_USER)

    if (savedAuth === 'true' && savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setIsAuthenticated(true)
        setUser(parsed)
      } catch {
        // si el JSON está corrupto, limpiamos
        localStorage.removeItem(LS_AUTH)
        localStorage.removeItem(LS_USER)
      }
    }

    setLoading(false)
  }, [])

  // ====== Derived userKey (multi-user stable key) ======
  const userKey = useMemo(() => {
    return user?.companyDb && user?.name ? `${user.companyDb}|${user.name}` : null
  }, [user?.companyDb, user?.name])

  // ====== Helpers for UI ======
  const getDisplayName = useCallback(() => {
    // prioridad: profile.fullName -> user.name -> "User"
    return safeTrim(profile?.profile?.fullName) || safeTrim(profile?.sap?.fullName) || safeTrim(user?.name) || 'User'
  }, [profile?.profile?.fullName, profile?.sap?.fullName, user?.name])

  const getAvatarText = useCallback(() => {
    const name = safeTrim(profile?.profile?.fullName) || safeTrim(profile?.sap?.fullName) || safeTrim(user?.name) || 'U'
    return buildInitials(name)
  }, [profile?.profile?.fullName, profile?.sap?.fullName, user?.name])

  // ====== Profile: Load from backend ======
  const hydrateProfile = useCallback(
    async (overrideUser) => {
      const u = overrideUser || user
      if (!u?.name || !u?.companyDb) return null

      setProfileLoading(true)
      try {
        const data = await getMyProfile(u)
        console.log('Data from getMyProfile on hydrate:', data)
        console.log('Data from getMyProfile:', data)
        setProfile(data)
        console.log('Profile set to:', data)
        return data
      } finally {
        setProfileLoading(false)
      }
    },
    [user]
  )

  // ====== Profile: Update (UPSERT) ======
  const updateProfile = useCallback(
    async (updates) => {
      if (!user?.name || !user?.companyDb) throw new Error('Not authenticated')

      setProfileLoading(true)
      try {
        const saved = await upsertMyProfile(user, updates)
        setProfile(saved)
        return saved
      } finally {
        setProfileLoading(false)
      }
    },
    [user]
  )

  // helper: update profile locally (sin guardar)
  const setProfileLocal = useCallback((partial) => {
    setProfile((prev) => ({ ...(prev || {}), ...(partial || {}) }))
  }, [])

  // ====== Login (SAP Service Layer) ======
  const login = useCallback(
    async (username, password) => {
      const payload = {
        UserName: username,
        Password: password,
        CompanyDB: 'SBO_COPA_LIVE',
      }

      const data = await slLogin(payload)

      const userData = {
        name: username,
        companyDb: payload.CompanyDB,
        sessionId: data?.SessionId || null, // solo informativo
        userKey: `${payload.CompanyDB}|${username}`,
      }

      setIsAuthenticated(true)
      setUser(userData)

      localStorage.setItem(LS_AUTH, 'true')
      localStorage.setItem(LS_USER, JSON.stringify(userData))

      // Cargar perfil al login (si backend no está listo, no rompe)
      try {
        await hydrateProfile(userData)
      } catch {
        // no bloquea login
      }

      return userData
    },
    [hydrateProfile]
  )

  // ====== Logout ======
  const logout = useCallback(async () => {
    try {
      await slLogout()
    } catch {
      /* no bloquea */
    }

    setIsAuthenticated(false)
    setUser(null)
    setProfile(null)

    localStorage.removeItem(LS_AUTH)
    localStorage.removeItem(LS_USER)
  }, [])

  // Opcional: cuando ya estoy autenticado y el profile no existe, intento hidratarlo
  useEffect(() => {
    console.log('Auto-hydrate triggered, isAuthenticated:', isAuthenticated, 'user:', user, 'profile:', profile)
    if (!isAuthenticated || !user?.name || !user?.companyDb) return
    if (profile) return
    hydrateProfile().catch((e) => console.error('Auto-hydrate error:', e))
    hydrateProfile().catch(() => {})
  }, [isAuthenticated, user?.name, user?.companyDb, profile, hydrateProfile])

  return (
    <AuthContext.Provider
      value={{
        // auth
        isAuthenticated,
        loading,
        user,
        userKey,
        login,
        logout,

        // profile
        profile,
        profileLoading,
        hydrateProfile,
        updateProfile,
        setProfileLocal,

        // helpers
        getDisplayName,
        getAvatarText,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext


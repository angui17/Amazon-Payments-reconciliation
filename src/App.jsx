import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/pages/Login'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './components/pages/Dashboard'
import Orders from './components/pages/Orders'
import Refunds from './components/pages/Refunds'
import Payments from './components/pages/Payments'
import Fees from './components/pages/Fees'
import Files from './components/pages/Files'
import Errors from './components/pages/Errors'
import Reports from './components/pages/Reports'
import Accounting from './components/pages/Accounting'
import Monitoring from './components/pages/Monitoring'
import Admin from './components/pages/Admin'
import UserProfile from './components/pages/UserProfile'
import AccountSettings from './components/pages/AccountSettings'
import Security from './components/pages/Security'
import Notifications from './components/pages/Notifications'
import './styles/dashboard.css'

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas - Todas dentro del DashboardLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders/:type" element={<Orders />} />
            <Route path="refunds/:type" element={<Refunds />} />  {/* sales o payments */}
            <Route path="payments" element={<Payments />} />
            <Route path="fees" element={<Fees />} />
            <Route path="files" element={<Files />} />
            <Route path="errors" element={<Errors />} />
            <Route path="reports" element={<Reports />} />
            <Route path="accounting" element={<Accounting />} />
            <Route path="monitoring" element={<Monitoring />} />
            <Route path="admin" element={<Admin />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="account-settings" element={<AccountSettings />} />
            <Route path="security" element={<Security />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
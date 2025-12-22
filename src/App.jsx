// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/pages/Login';
// import Dashboard from './components/pages/Dashboard';
// import './styles/dashboard.css';

// // Contexto de autenticación
// export const AuthContext = React.createContext();

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Verificar si hay sesión guardada
//     const savedAuth = localStorage.getItem('amazonpay_auth');
//     if (savedAuth === 'true') {
//       setIsAuthenticated(true);
//     }
//     setLoading(false);
//   }, []);

//   const login = () => {
//     setIsAuthenticated(true);
//     localStorage.setItem('amazonpay_auth', 'true');
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem('amazonpay_auth');
//   };

//   // Componente para rutas protegidas
//   const ProtectedRoute = ({ children }) => {
//     if (loading) return <div className="loading-screen">Cargando...</div>;
//     return isAuthenticated ? children : <Navigate to="/login" />;
//   };

//   if (loading) {
//     return <div className="loading-screen">Cargando aplicación...</div>;
//   }

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route
//             path="/*"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthContext.Provider>
//   );
// }

// export default App;

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
            <Route path="orders" element={<Orders />} />
            <Route path="refunds" element={<Refunds />} />
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
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
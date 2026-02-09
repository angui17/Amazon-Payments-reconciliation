import React, { useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TopNav = () => {
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showSalesDropdown, setShowSalesDropdown] = useState(false)
  const [showPaymentsDropdown, setShowPaymentsDropdown] = useState(false)

  const salesRef = useRef(null)
  const paymentsRef = useRef(null)
  const [salesPosition, setSalesPosition] = useState({ left: 0 })
  const [paymentsPosition, setPaymentsPosition] = useState({ left: 0 })

  const { logout, getDisplayName, getAvatarText } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);  
  const navigate = useNavigate()

  const userRef = useRef(null);  // ✅ Ref para calcular posición
  const [userPosition, setUserPosition] = useState({ left: 0 });  // ✅ Estado para posición

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    {
      label: 'Sales',
      children: [
        { path: '/orders/sales', label: 'Orders' },
        { path: '/refunds/sales', label: 'Refunds' },
        { path: '/fees/sales', label: 'Fees' },
      ],
    },
    {
      label: 'Payments',
      children: [
        { path: '/orders/payments', label: 'Orders' },
        { path: '/refunds/payments', label: 'Refunds' },
        { path: '/fees/payments', label: 'Fees' },
      ],
    },
    // { path: '/files', label: 'Files' },
    { path: '/errors', label: 'Errors' },
    { path: '/reports', label: 'Reports' },
    { path: '/accounting', label: 'Accounting' },
    // { path: '/monitoring', label: 'Monitoring' },
    // { path: '/admin', label: 'Admin' },
  ]

  const userMenuItems = [
    { path: '/user-profile', label: 'My Profile'},
    //{ path: '/account-settings', label: 'Account Settings', icon: '⚙️' },
    //{ path: '/security', label: 'Security', icon: '🔒' },
    //{ path: '/notifications', label: 'Notifications', icon: '🔔' },
  ]

  // const handleLogout = () => {
  //   if (window.confirm('Are you sure you want to logout?')) {
  //     logout()
  //     navigate('/login')
  //   }
  //   setShowUserDropdown(false)
  // }

  const handleLogout = () => {
    setShowLogoutConfirm(true);  // ✅ Muestra el modal en lugar de window.confirm
    setShowUserDropdown(false);  // Cierra el dropdown del usuario
  }

  // Función para confirmar logout
  const confirmLogout = async () => {
    setShowLogoutConfirm(false);  // Oculta el modal
    await logout();  // Llama al logout real
    navigate('/login');  // Navega a login
  };

  // Función para cancelar
  const cancelLogout = () => {
    setShowLogoutConfirm(false);  // Oculta el modal
  };

  return (
    <div className="top-nav">
      <div className="logo">AmazonPay Reconciliation</div>

      <div className="nav-tabs">
        {navItems.map((item) => {
          // 🔽 SALES DROPDOWN
          if (item.label === 'Sales') {
            return (
              <div
                key={item.label}
                ref={salesRef}
                className="nav-tab sales-dropdown"
                onMouseEnter={() => {
                  const rect = salesRef.current.getBoundingClientRect()
                  setSalesPosition({ left: rect.left })
                  setShowSalesDropdown(true)
                }}
                onMouseLeave={() => setShowSalesDropdown(false)}
              >
                <span>Sales ▾</span>

                {showSalesDropdown && (
                  <div
                    className="sales-dropdown-menu"
                    style={{ left: `${salesPosition.left}px` }}
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className="sales-dropdown-item"
                        onClick={() => setShowSalesDropdown(false)}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          // 🔽 PAYMENTS DROPDOWN
          if (item.label === 'Payments') {
            return (
              <div
                key={item.label}
                ref={paymentsRef}
                className="nav-tab payments-dropdown"
                onMouseEnter={() => {
                  const rect = paymentsRef.current.getBoundingClientRect()
                  setPaymentsPosition({ left: rect.left })
                  setShowPaymentsDropdown(true)
                }}
                onMouseLeave={() => setShowPaymentsDropdown(false)}
              >
                <span>Payments ▾</span>

                {showPaymentsDropdown && (
                  <div
                    className="payments-dropdown-menu"
                    style={{ left: `${paymentsPosition.left}px` }}
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className="payments-dropdown-item"
                        onClick={() => setShowPaymentsDropdown(false)}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          // 🔹 ITEM NORMAL
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-tab ${isActive ? 'active' : ''}`
              }
              onClick={() => setShowUserDropdown(false)}
            >
              {item.label}
            </NavLink>
          )
        })}
      </div>

      {/* USER MENU */}
      <div onMouseLeave={() => setShowUserDropdown(false)}>
      <div
        ref={userRef}
        className="user-menu"
        onClick={() => setShowUserDropdown(!showUserDropdown)}
        onMouseEnter={() => {
          const rect = userRef.current.getBoundingClientRect()
          setUserPosition({ right: rect.right })
          setShowUserDropdown(true)
        }}
        onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
        tabIndex={0}
      >
        {getDisplayName()}
      </div>
        <div className={`user-dropdown ${showUserDropdown ? 'active' : ''}`}>
          {userMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="user-dropdown-item"
              onClick={() => setShowUserDropdown(false)}
            >
              {item.label}
            </NavLink>
          ))}
        <div className="user-dropdown-item logout" onClick={handleLogout}>
          Logout
        </div>
      </div>
      </div>
      
      {/* Modal de confirmación para logout */}
      {showLogoutConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={cancelLogout}  // Cierra al hacer clic fuera
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}  // Evita cerrar al hacer clic dentro
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Logout</h3>
            <p style={{ margin: '0 0 20px 0', color: '#666' }}>
              Are you sure you want to logout?
            </p>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: '#f0f0f0',
                  color: '#333',
                }}
                onClick={cancelLogout}
                onMouseOver={(e) => (e.target.style.opacity = '0.9')}
                onMouseOut={(e) => (e.target.style.opacity = '1')}
              >
                Cancel
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: '#FF6B00',
                  color: 'white',
                }}
                onClick={confirmLogout}
                onMouseOver={(e) => (e.target.style.opacity = '0.9')}
                onMouseOut={(e) => (e.target.style.opacity = '1')}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopNav
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
  const navigate = useNavigate()

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
    { path: '/user-profile', label: 'My Profile', icon: '👤' },
    { path: '/account-settings', label: 'Account Settings', icon: '⚙️' },
    { path: '/security', label: 'Security', icon: '🔒' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
  ]

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
    }
    setShowUserDropdown(false)
  }

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
      <div
        className="user-menu"
        onClick={() => setShowUserDropdown(!showUserDropdown)}
        onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
        tabIndex={0}
      >
        {/* <div>{user?.name || 'User'}</div>
        <div className="user-avatar">{user?.avatar || '👤'}</div> */}
        <div>{getDisplayName()}</div>
        <div className="user-avatar">{getAvatarText()}</div>

        <div className={`user-dropdown ${showUserDropdown ? 'active' : ''}`}>
          {userMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="user-dropdown-item"
              onClick={() => setShowUserDropdown(false)}
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}

          <div className="user-dropdown-item logout" onClick={handleLogout}>
            <span>🚪</span> Logout
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNav
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TopNav = () => {
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard'},
    { path: '/orders', label: 'Orders'},
    { path: '/refunds', label: 'Refunds'},
    { path: '/payments', label: 'Payments'},
    { path: '/fees', label: 'Fees'},
    { path: '/files', label: 'Files'},
    { path: '/errors', label: 'Errors'},
    { path: '/reports', label: 'Reports'},
    { path: '/accounting', label: 'Accounting'},
    { path: '/monitoring', label: 'Monitoring'},
    { path: '/admin', label: 'Admin'},
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
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            onClick={() => setShowUserDropdown(false)}
          >
            <span style={{ marginRight: '8px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
      <div 
        className="user-menu" 
        onClick={() => setShowUserDropdown(!showUserDropdown)}
        onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
        tabIndex={0}
      >
        <div>{user?.name || 'User'}</div>
        <div className="user-avatar">
          {user?.avatar || '👤'}
        </div>
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
          <div 
            className="user-dropdown-item logout"
            onClick={handleLogout}
          >
            <span>🚪</span> Logout
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNav
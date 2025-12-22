import React, { useContext } from 'react';
import { AuthContext } from '../../App';

const TopNav = ({ activePage, onPageChange, showUserDropdown, setShowUserDropdown }) => {
  const { logout } = useContext(AuthContext);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Orders' },
    { id: 'refunds', label: 'Refunds' },
    { id: 'payments', label: 'Payments' },
    { id: 'fees', label: 'Fees' },
    { id: 'files', label: 'Files' },
    { id: 'errors', label: 'Errors' },
    { id: 'reports', label: 'Reports' },
    { id: 'accounting', label: 'Accounting' },
    { id: 'monitoring', label: 'Monitoring' },
    { id: 'admin', label: 'Admin' },
  ];

  const userMenuItems = [
    { id: 'user-profile', label: 'My Profile', icon: '👤' },
    { id: 'account-settings', label: 'Account Settings', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      setShowUserDropdown(false);
    }
  };

  return (
    <div className="top-nav">
      <div className="logo">AmazonPay Reconciliation</div>
      <div className="nav-tabs">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-tab ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div 
        className="user-menu" 
        onClick={() => setShowUserDropdown(!showUserDropdown)}
      >
        <div>John Doe</div>
        <div>👤</div>
        <div className={`user-dropdown ${showUserDropdown ? 'active' : ''}`}>
          {userMenuItems.map((item) => (
            <div
              key={item.id}
              className="user-dropdown-item"
              onClick={() => {
                onPageChange(item.id);
                setShowUserDropdown(false);
              }}
            >
              <span>{item.icon}</span> {item.label}
            </div>
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
  );
};

export default TopNav;
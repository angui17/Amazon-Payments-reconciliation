// Sidebar izquierdo con filtros

import React, { useState } from 'react';

const LeftSidebar = ({ activePage, onUploadCSV }) => {
  const [filters, setFilters] = useState({
    dateRange: 'Last 7 days',
    status: 'All Statuses',
    customer: 'All Customers'
  });

  const sidebarTitles = {
    'dashboard': 'Dashboard Filters',
    'orders': 'Order Filters', 
    'refunds': 'Refund Filters',
    'payments': 'Payment Filters',
    'fees': 'Fee Filters',
    'files': 'File Management',
    'errors': 'Error Filters',
    'reports': 'Report Filters',
    'accounting': 'Accounting Filters',
    'monitoring': 'Monitoring Settings',
    'admin': 'Admin Controls',
    'user-profile': 'User Settings',
    'account-settings': 'Account Settings',
    'security': 'Security Settings',
    'notifications': 'Notification Settings'
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'reconcile':
        alert('Triggering reconciliation process...');
        break;
      case 'retry':
        alert('Retrying failed jobs...');
        break;
      default:
        break;
    }
  };

  return (
    <div className="left-sidebar">
      <div className="filter-section">
        <h3 id="sidebar-title">{sidebarTitles[activePage] || 'Filters'}</h3>
        
        <div className="filter-group">
          <label htmlFor="date-range">Date Range</label>
          <select 
            id="date-range" 
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Custom range</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select 
            id="status" 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option>All Statuses</option>
            <option>Success</option>
            <option>Pending</option>
            <option>Error</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="customer">Customer</label>
          <select 
            id="customer" 
            value={filters.customer}
            onChange={(e) => handleFilterChange('customer', e.target.value)}
          >
            <option>All Customers</option>
            <option>Amazon US</option>
            <option>Amazon CA</option>
            <option>Amazon UK</option>
          </select>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <button className="btn btn-primary" onClick={onUploadCSV}>
          <span>📁</span> Upload CSV
        </button>
        <button className="btn btn-primary" onClick={() => handleQuickAction('reconcile')}>
          <span>🔄</span> Trigger Reconciliation
        </button>
        <button className="btn btn-outline" onClick={() => handleQuickAction('retry')}>
          <span>🔄</span> Retry Failed Jobs
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
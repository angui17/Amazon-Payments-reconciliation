import React, { useState } from 'react'

const LeftSidebar = ({ title, onUploadCSV }) => {
  const [filters, setFilters] = useState({
    dateRange: 'Last 7 days',
    status: 'All Statuses',
    customer: 'All Customers'
  })

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case 'reconcile':
        alert('Triggering reconciliation process...')
        break
      case 'retry':
        alert('Retrying failed jobs...')
        break
      case 'export':
        alert('Exporting data...')
        break
      default:
        break
    }
  }

  return (
    <div className="left-sidebar">
      <div className="filter-section">
        <h3>{title}</h3>
        
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
            <option>Warning</option>
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
            <option>Amazon DE</option>
            <option>Amazon FR</option>
            <option>Amazon JP</option>
          </select>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <button className="btn btn-primary" onClick={onUploadCSV}>
          <span>📁</span> Upload CSV
        </button>
        <button className="btn btn-primary" onClick={() => handleQuickAction('reconcile')}>
          <span>🔄</span> Run Reconciliation
        </button>
        <button className="btn btn-outline" onClick={() => handleQuickAction('retry')}>
          <span>🔄</span> Retry Failed
        </button>
        <button className="btn btn-outline" onClick={() => handleQuickAction('export')}>
          <span>📤</span> Export Data
        </button>
      </div>

      <div className="system-status">
        <h3>System Status</h3>
        <div className="status-item">
          <div className="status-indicator online"></div>
          <span>API Connection</span>
          <span className="status-text">Online</span>
        </div>
        <div className="status-item">
          <div className="status-indicator online"></div>
          <span>Database</span>
          <span className="status-text">Healthy</span>
        </div>
        <div className="status-item">
          <div className="status-indicator warning"></div>
          <span>Queue Depth</span>
          <span className="status-text">42 items</span>
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar
import React from 'react'

const OrderFilters = ({ status, onStatusChange, statuses = [] }) => {
  const options = Array.isArray(statuses) && statuses.length > 0 ? statuses : ['Balanced', 'Delayed', 'Pending'];
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', marginBottom: 6 }}>Status</label>
      <select value={status || ''} onChange={(e) => onStatusChange && onStatusChange(e.target.value)} className="input">
        <option value="">All</option>
        {options.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  )
}

export default OrderFilters

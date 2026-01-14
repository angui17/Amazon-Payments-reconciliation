import React from 'react'

const OrderActions = ({ onExport }) => {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <button className="btn" onClick={() => onExport && onExport()}>Export CSV</button>
      <button className="btn btn-outline">Upload CSV</button>
    </div>
  )
}

export default OrderActions

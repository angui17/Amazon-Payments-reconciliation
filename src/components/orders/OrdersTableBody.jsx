import React from 'react'

const OrdersTableBody = ({ rows }) => {
  if (!rows || rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={12} style={{ textAlign: 'center', padding: 20 }}>
            No orders found
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody>
      {rows.map((row, idx) => (
        <tr key={`${row.ORDER_ID}-${row.AMOUNT_DESCRIPTION}-${idx}`}>
          <td>{row.ORDER_ID}</td>
          <td>{row.SKU || row.sku}</td>
          <td title={row.DESCRIPTION}>
            {row.DESCRIPTION ? row.DESCRIPTION.substring(0, 50) + '...' : ''}
          </td>
          <td>{row.QUANTITY || row.quantity}</td>
          <td>{row.MARKETPLACE}</td>
          <td>{row.FULFILLMENT}</td>
          <td>{`${row.ORDER_CITY || ''}${row.ORDER_STATE ? `, ${row.ORDER_STATE}` : ''}`}</td>
          <td>
            {row.PRODUCT_SALES
              ? `$${row.PRODUCT_SALES.toLocaleString()}`
              : ''}
          </td>
          <td>
            {row.DATE_TIME
              ? new Date(row.DATE_TIME).toLocaleDateString()
              : ''}
          </td>
          <td>
            {typeof row.TOTAL === 'number'
              ? `$${row.TOTAL.toLocaleString()}`
              : (row.TOTAL || '')}
          </td>
          <td>{row.STATUS}</td>
          <td>
            <button className="btn btn-sm">View</button>
            <button
              className="btn btn-sm btn-outline"
              style={{ marginLeft: 8 }}
            >
              Edit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  )
}

export default OrdersTableBody

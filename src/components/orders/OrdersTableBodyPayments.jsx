import React from 'react'

const OrdersTableBodyPayments = ({ rows }) => {
  if (!rows || rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>
            No payments found
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody>
      {rows.map((row, idx) => (
        <tr key={`${row.ORDER_ID}-${row.AMOUNT_DESCRIPTION}-${idx}`}>
          {/* Order ID */}
          <td>{row.ORDER_ID || row.order_id}</td>

          {/* SKU */}
          <td>{row.sku || '-'}</td>

          {/* Amount description */}
          <td title={row.AMOUNT_DESCRIPTION}>
            {row.AMOUNT_DESCRIPTION}
          </td>

          {/* Amount */}
          <td>
            {typeof row.amount === 'number'
              ? `$${row.amount.toFixed(2)}`
              : '-'}
          </td>

          {/* Status */}
          <td>{row.status}</td>

          {/* Total Amount */}
          <td>
            {typeof row['total-amount'] === 'number'
              ? `$${row['total-amount'].toLocaleString()}`
              : '-'}
          </td>

          {/* Actions */}
          <td>
            <button className="btn btn-sm">View</button>
          </td>
        </tr>
      ))}
    </tbody>
  )
}

export default OrdersTableBodyPayments

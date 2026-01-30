import React from 'react'
import StatusBadge from "../ui/StatusBadge";
import { formatDescription } from '../../utils/textUtils';


const OrdersTableBody = ({ rows, onView }) => {

  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan={12} style={{ textAlign: 'center', padding: 20 }}>
          No orders found
        </td>
      </tr>
    )
  }

  return (
    <>
      {rows.map((row, idx) => (
        <tr key={`${row.ORDER_ID || row.order_id || idx}-${idx}`}>
          <td>{row.ORDER_ID || row.order_id || '-'}</td>

          <td>{row.SKU || row.sku || '-'}</td>

          <td title={row.DESCRIPTION || row.description || ""}>
            {formatDescription(row.DESCRIPTION || row.description)}
          </td>

          <td className='text-center'>{row.QUANTITY ?? row.quantity ?? '-'}</td>

          <td>{row.MARKETPLACE || row.marketplace || '-'}</td>

          <td>{row.FULFILLMENT || row.fulfillment || '-'}</td>

          <td>
            {`${row.ORDER_CITY || row.city || ''}${(row.ORDER_STATE || row.state) ? `, ${row.ORDER_STATE || row.state}` : ''}` || '-'}
          </td>

          <td>
            {row.PRODUCT_SALES != null
              ? `$${Number(row.PRODUCT_SALES).toLocaleString()}`
              : '-'}
          </td>

          <td>
            {row.DATE_TIME
              ? new Date(row.DATE_TIME).toLocaleDateString()
              : '-'}
          </td>

          <td>
            {row.TOTAL != null
              ? `$${Number(row.TOTAL).toLocaleString()}`
              : '-'}
          </td>

          <td>
            <StatusBadge status={row.STATUS || row.status} />
          </td>
          <td>
            <button className="btn btn-sm" onClick={() => onView?.(row)}>Details</button>
          </td>
        </tr>
      ))}
    </>
  )
}

export default OrdersTableBody

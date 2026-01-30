import React from 'react'

const ORDER_COLUMNS_SALES = [
    { id: 'order_id', label: 'Order ID' },
    { id: 'sku', label: 'SKU' },
    { id: 'description', label: 'Description' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'fulfillment', label: 'Fulfillment' },
    { id: 'city_state', label: 'City / State' },
    { id: 'product_sales', label: 'Sales' },
    { id: 'date_time', label: 'Date' },
    { id: 'total', label: 'Total' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }
]

const ORDER_COLUMNS_PAYMENTS = [
    { id: 'order_id', label: 'Order ID' },
    { id: 'sku', label: 'SKU' },
    { id: 'posted_date', label: 'Posted date' },
    { id: 'description', label: 'Amount description' },
    { id: 'amount', label: 'Amount' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }
]

const OrdersTableHeaders = ({ type }) => {
  const columns =
    type === 'payments'
      ? ORDER_COLUMNS_PAYMENTS
      : ORDER_COLUMNS_SALES

  return (
    <thead>
      <tr>
        {columns.map(col => (
          <th key={col.id}>{col.label}</th>
        ))}
      </tr>
    </thead>
  )
}

export default OrdersTableHeaders

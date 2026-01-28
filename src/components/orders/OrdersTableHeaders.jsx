import React from 'react'

const ORDER_COLUMNS = [
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

const OrdersTableHeaders = () => {
    return (
        <thead>
            <tr>
                {ORDER_COLUMNS.map(col => (
                    <th key={col.id}>{col.label}</th>
                ))}
            </tr>
        </thead>
    )
}

export default OrdersTableHeaders

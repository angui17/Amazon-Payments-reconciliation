// Convierte órdenes del sistema a filas CSV
export function buildOrdersCsvData(orders = []) {
  return orders.map(order => ({
    ID_UNIQUE: order.ID_UNIQUE,
    DATE_TIME: order.DATE_TIME,
    SETTLEMENT_ID: order.SETTLEMENT_ID,
    TYPE: order.TYPE,
    ORDER_ID: order.ORDER_ID,
    SKU: order.SKU,
    DESCRIPTION: order.DESCRIPTION,
    QUANTITY: order.QUANTITY,
    MARKETPLACE: order.MARKETPLACE,
    ACCOUNT_TYPE: order.ACCOUNT_TYPE,
    FULFILLMENT: order.FULFILLMENT,
    ORDER_CITY: order.ORDER_CITY,
    ORDER_STATE: order.ORDER_STATE,
    ORDER_POSTAL: order.ORDER_POSTAL,
    TAX_COLLECTION_MODEL: order.TAX_COLLECTION_MODEL,
    PRODUCT_SALES: order.PRODUCT_SALES,
    PRODUCT_SALES_TAX: order.PRODUCT_SALES_TAX,
    SHIPPING_CREDITS: order.SHIPPING_CREDITS,
    TOTAL: order.TOTAL,
    STATUS: order.STATUS
  }))
}

// Descarga CSV en el browser
export function exportToCSV(data = [], filename = 'export.csv') {
  if (!data.length) return

  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row =>
    Object.values(row)
      .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(',')
  )

  const csvContent = [headers, ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

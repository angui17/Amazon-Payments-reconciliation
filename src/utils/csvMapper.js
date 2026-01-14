// Small CSV-to-domain mappers. Map normalized CSV keys to canonical fields per page.
export function normalizeKey(key) {
  if (!key) return ''
  return key.replace(/"/g, '').replace(/\//g, '').replace(/\s+/g, '').toUpperCase()
}

export function mapToOrders(record, idx) {
  // record: object with normalized uppercase keys like ORDERID, SKU, PRODUCTSALES, SETTLEMENTID, QUANTITY
  const get = (k) => record[k] ?? ''
  const amazonOrderId = get('ORDERID') || get('ORDERID') || get('ORDERID')
  const sku = get('SKU') || ''
  // amount prefer PRODUCTSALES then TOTAL
  const amountRaw = get('PRODUCTSALES') || get('PRODUCTSALES') || get('TOTAL') || ''
  const amount = parseFloat(String(amountRaw).replace(/[^0-9.-]+/g, '')) || 0
  const sapDoc = get('SETTLEMENTID') || ''
  const quantity = parseInt(String(get('QUANTITY') || '0'), 10) || 0
  const date = get('DATETIME') || get('DATETIME') || get('DATETIME') || get('DATETIME') || get('DATETIME')
  return {
    id: `csv-${Date.now()}-${idx}`,
    amazonOrderId,
    sku,
    amount,
    sapDoc,
    quantity,
    date,
    status: 'Imported',
    raw: record
  }
}

export function mapToPayments(record, idx) {
  // stub: map to payment shape
  return { id: `csv-pay-${idx}`, raw: record }
}

export function mapToRefunds(record, idx) {
  // stub: map to refund shape
  return { id: `csv-ref-${idx}`, raw: record }
}

import { useState, useEffect } from 'react'

export const useOrders = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    // mock data
    const mock = [
      { id: 1, amazonOrderId: 'AMZ-1001', sku: 'SKU-001', amount: 45127.5, sapDoc: 'SAP-9001', status: 'Balanced' },
      { id: 2, amazonOrderId: 'AMZ-1002', sku: 'SKU-002', amount: 21450.25, sapDoc: 'SAP-9002', status: 'Delayed' },
      { id: 3, amazonOrderId: 'AMZ-1003', sku: 'SKU-003', amount: 18230.75, sapDoc: 'SAP-9003', status: 'Pending' }
    ]

    setLoading(true)
    const t = setTimeout(() => {
      if (!mounted) return
      setData(mock)
      setLoading(false)
    }, 300)

    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [])

  return { data, loading, error }
}

export default useOrders

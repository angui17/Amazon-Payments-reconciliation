import React, { createContext, useContext, useState, useCallback } from 'react'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  // raw uploaded rows (as parsed from CSV)
  const [uploadedRowsRaw, setUploadedRowsRaw] = useState([])
  // namespaced rows per page (orders/payments/refunds)
  const [uploadedByPage, setUploadedByPage] = useState({ orders: [], payments: [], refunds: [] })

  const addRawRows = useCallback((rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return
    setUploadedRowsRaw((prev) => [...rows, ...prev])
  }, [])

  const addRowsForPage = useCallback((page, rows) => {
    if (!page || !Array.isArray(rows) || rows.length === 0) return
    setUploadedByPage((prev) => ({ ...prev, [page]: [...rows, ...(prev[page] || [])] }))
  }, [])

  // convenience: add rows to the 'orders' page by default
  const addRows = useCallback((rows) => addRowsForPage('orders', rows), [addRowsForPage])

  const clearRows = useCallback(() => {
    setUploadedRowsRaw([])
    setUploadedByPage({ orders: [], payments: [], refunds: [] })
  }, [])

  return (
    <DataContext.Provider value={{ uploadedRowsRaw, uploadedByPage, addRawRows, addRowsForPage, addRows, clearRows }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

export default DataContext

import React, { useMemo, useState, useEffect } from 'react'
import { useParams } from "react-router-dom"

// import { CSVLink } from 'react-csv'  
// import { Bar, Line } from 'react-chartjs-2'  // Para gráficos 
import useOrdersApi from '../../hooks/useOrdersApi'
import OrderFilters from '../orders/OrderFilters'
import OrderActions from '../orders/OrderActions'
import { useData } from '../../context/DataContext'

import { getOrdersSales, getOrdersPayments } from "../../api/orders"

//Estilos 
import '../../styles/dashboard.css'

// Tabla
import OrdersTableHeaders from '../orders/OrdersTableHeaders'
import OrdersTableBody from '../orders/OrdersTableBody'

// Para exportación a CSV
import { buildOrdersCsvData, exportToCSV } from '../../utils/ordersExport'


const Orders = () => {
  const { type } = useParams();  // sales o payments

  const [orders, setOrders] = useState([])
  const [ordersAll, setOrdersAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [refresh, setRefresh] = useState(0)
  // const { data = [], loading, error, info } = useOrdersApi({ page, perPage: pageSize, filters, refresh })
  const [search, setSearch] = useState('')

  const [statusFilter, setStatusFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  // Datos para gráficos 
  const chartData = useMemo(() => {
    const salesByDate = {};
    const statusCount = {};

    (ordersAll || []).forEach(order => {
      const date = new Date(order.DATE_TIME).toLocaleDateString();
      salesByDate[date] = (salesByDate[date] || 0) + (order.TOTAL || 0);
      statusCount[order.STATUS] = (statusCount[order.STATUS] || 0) + 1;
    });

    return { salesByDate, statusCount };
  }, [ordersAll]);


  const filtered = useMemo(() => {
    let list = orders || []
    const q = search.trim().toLowerCase()

    if (statusFilter) {
      list = list.filter(r => String(r.status) === String(statusFilter))
    }

    if (!q) return list

    return list.filter(r =>
      String(r.order_id || r.amazonOrderId || '').toLowerCase().includes(q) ||
      String(r.sku || '').toLowerCase().includes(q) ||
      String(r.status || '').toLowerCase().includes(q)
    )
  }, [orders, search, statusFilter])


  function formatToMMDDYYYY(value) {
    if (!value) return '';
    // value expected as YYYY-MM-DD from input[type=date]
    const parts = value.split('-');
    if (parts.length !== 3) return value;
    return `${parts[1]}-${parts[2]}-${parts[0]}`;
  }

  function applyDateFilter() {
    const f = {};
    if (dateRange.start) f.fecha_desde = formatToMMDDYYYY(dateRange.start);  // Formatear aquí
    if (dateRange.end) f.fecha_hasta = formatToMMDDYYYY(dateRange.end);     // Formatear aquí
    setFilters(f);
    setPage(1);
  }

  function clearDateFilter() {
    setDateRange({ start: '', end: '' });
    setFilters({});
    setPage(1);
  }

  const statuses = useMemo(() => {
    const s = new Set((ordersAll || []).map(r => r?.status).filter(Boolean));
    return Array.from(s);
  }, [ordersAll]);


  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const { uploadedByPage } = useData()
  const uploadedOrders = (uploadedByPage && uploadedByPage.orders) || []

  useEffect(() => {
    const fetchOrders = async () => {

      try {
        setLoading(true)

        const params = {
          fecha_desde: dateRange.start ? formatToMMDDYYYY(dateRange.start) : undefined,
          fecha_hasta: dateRange.end ? formatToMMDDYYYY(dateRange.end) : undefined,
        }

        if (type === "sales") {
          const all = await getOrdersSales(params)
          setOrdersAll(all)

          const data = await getOrdersSales({ ...params, limit: 10 })
          setOrders(data)
        }

        if (type === "payments") {
          const all = await getOrdersPayments(params)
          setOrdersAll(all)

          const data = await getOrdersPayments({ ...params, limit: 10 })
          setOrders(data)
        }
      } catch (err) {
        console.error("Error fetching orders", err)
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [type, dateRange, uploadedOrders.length])

  console.log(orders)
  return (
    <div className="page">
      <div className="content-header">
        <h1>Orders</h1>
        <p>Listado de órdenes (mock)</p>
      </div>

      {/* Agregar sección de gráficos */}
      <div style={{ marginBottom: 20 }}>
        <h2>Charts & Reports</h2>
        {/* <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ width: '45%' }}>
            <h3>Sales by Date</h3>
            <Line data={{
              labels: Object.keys(chartData.salesByDate),
              datasets: [{ label: 'Total Sales', data: Object.values(chartData.salesByDate), backgroundColor: 'rgba(75,192,192,0.2)' }]
            }} />
          </div>
          <div style={{ width: '45%' }}>
            <h3>Orders by Status</h3>
            <Bar data={{
              labels: Object.keys(chartData.statusCount),
              datasets: [{ label: 'Count', data: Object.values(chartData.statusCount), backgroundColor: 'rgba(153,102,255,0.2)' }]
            }} />
          </div>
        </div> */}
        <p>Sales by Date: {Object.keys(chartData.salesByDate).length} data points</p>
        <p>Orders by Status: {Object.keys(chartData.statusCount).length} statuses</p>

        {/* Botón de exportación */}
        <button className="btn btn-sm" onClick={() => exportToCSV(buildOrdersCsvData(ordersAll), 'orders_report.csv')}>
          Export to CSV
        </button>
      </div>

      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <OrderActions />
          <OrderFilters status={statusFilter} statuses={statuses} onStatusChange={(v) => { setStatusFilter(v); setPage(1) }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 12 }}>Desde</label>
            <input type="date" value={dateRange.start} onChange={(e) => setDateRange((d) => ({ ...d, start: e.target.value }))} className="input" />
            <label style={{ fontSize: 12 }}>Hasta</label>
            <input type="date" value={dateRange.end} onChange={(e) => setDateRange((d) => ({ ...d, end: e.target.value }))} className="input" />
            <button className="btn btn-sm" onClick={applyDateFilter}>Apply</button>
            <button className="btn btn-sm btn-outline" onClick={clearDateFilter}>Clear</button>
          </div>
        </div>
        <div>
          <input
            placeholder="Buscar por Order ID, SKU o SAP..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input"
            style={{ width: 320 }}
          />
        </div>
      </div>

      {error ? (
        <div style={{ color: 'red', padding: 12 }}>
          <div>Error loading orders: {error}</div>
          {info && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#222' }}>
              <div><strong>Request:</strong> {info.request && info.request.url ? info.request.url : 'n/a'}</div>
              <div><strong>Request Body:</strong> <pre style={{ whiteSpace: 'pre-wrap' }}>{info.request && info.request.body ? JSON.stringify(info.request.body) : 'n/a'}</pre></div>
              <div><strong>Response Text:</strong> <pre style={{ whiteSpace: 'pre-wrap' }}>{info.responseText || JSON.stringify(info.fallback) || 'n/a'}</pre></div>
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-sm" onClick={() => setRefresh((r) => r + 1)}>Retry</button>
          </div>
        </div>
      ) : uploadedOrders && uploadedOrders.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                {Object.keys(uploadedOrders[0]).map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploadedOrders.map((row, idx) => (
                <tr key={row.id || idx}>
                  {Object.keys(uploadedOrders[0]).map((k) => (
                    <td key={k + idx}>{row[k]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : loading ? (
        <div>Loading orders...</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <OrdersTableHeaders />
            <OrdersTableBody rows={orders} />
          </table>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div>
          <button className="btn btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
          <button className="btn btn-sm" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount} style={{ marginLeft: 8 }}>Next</button>
        </div>
        <div>
          Page {page} of {pageCount} •
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }} style={{ marginLeft: 8 }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Orders
import React, { useMemo, useState, useEffect } from 'react'

import OrderFilters from '../orders/OrderFilters'
import OrderActions from '../orders/OrderActions'
import { useData } from '../../context/DataContext'

import { getOrdersSales } from "../../api/orders"

// Estilos
import '../../styles/dashboard.css'
import '../../styles/pagination.css'

// utils
import { sumBy, formatMoney, toNumber } from "../../utils/refundMath";
import { dateToTs, dateToTsEnd } from "../../utils/dateUtils";

// Tabla
import OrdersTableHeaders from '../orders/OrdersTableHeaders'
import OrdersTableBody from '../orders/OrdersTableBody'
import OrdersTableSkeleton from './OrdersTableSkeleton'

// Exportación CSV
import { buildOrdersCsvData, exportToCSV } from '../../utils/ordersExport'

// KPI Cards
import KPICard from '../common/KPICard'

// Details
import SalesOrderDetailsModal from './OrdersDetailsModal'

// Charts
import OrdersSalesCharts from '../charts/Orders/OrdersSalesCharts'

// Filters 
import OrdersFiltersBar from "../orders/OrdersFiltersBar";

const DEFAULT_FROM = "2024-10-01";
const DEFAULT_TO = "2024-10-31";

const SalesOrders = () => {
    const [ordersAll, setOrdersAll] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [refresh, setRefresh] = useState(0)
    const [search, setSearch] = useState('')

    const fechaDesde = "10-01-2024";
    const fechaHasta = "10-31-2024";

    const [statusFilter, setStatusFilter] = useState('')
    const [dateRange, setDateRange] = useState({ start: DEFAULT_FROM, end: DEFAULT_TO })

    const { uploadedByPage } = useData()
    const uploadedOrders = (uploadedByPage && uploadedByPage.orders) || []

    // details
    const [selectedOrder, setSelectedOrder] = useState(null);

    // filters 
    const [settlementIdFilter, setSettlementIdFilter] = useState("");
    const [orderIdFilter, setOrderIdFilter] = useState("");
    const [skuFilter, setSkuFilter] = useState("");

    const filtered = useMemo(() => {
        const fromTs = dateRange.start ? dateToTs(dateRange.start) : null;
        const toTs = dateRange.end ? dateToTsEnd(dateRange.end) : null;

        const q = (search || "").trim().toLowerCase();

        return (ordersAll || []).filter((o) => {
            const status = String(o.STATUS || o.status || "");
            const settlement = String(o.SETTLEMENT_ID || "");
            const orderId = String(o.ORDER_ID || o.order_id || "");
            const sku = String(o.SKU || o.sku || "");

            const matchStatus = !statusFilter || status === String(statusFilter);

            const matchSettlement =
                !settlementIdFilter || settlement.toLowerCase().includes(settlementIdFilter.toLowerCase());

            const matchOrderId =
                !orderIdFilter || orderId.toLowerCase().includes(orderIdFilter.toLowerCase());

            const matchSku =
                !skuFilter || sku.toLowerCase().includes(skuFilter.toLowerCase());

            const rowTs = dateToTs(o.DATE);
            const matchFrom = !fromTs || (rowTs !== null && rowTs >= fromTs);
            const matchTo = !toTs || (rowTs !== null && rowTs <= toTs);

            // search global (opcional): busca por orderId, sku, settlement, status
            const matchSearch =
                !q ||
                orderId.toLowerCase().includes(q) ||
                sku.toLowerCase().includes(q) ||
                settlement.toLowerCase().includes(q) ||
                status.toLowerCase().includes(q);

            return (
                matchStatus &&
                matchSettlement &&
                matchOrderId &&
                matchSku &&
                matchFrom &&
                matchTo &&
                matchSearch
            );
        });
    }, [
        ordersAll,
        search,
        statusFilter,
        settlementIdFilter,
        orderIdFilter,
        skuFilter,
        dateRange.start,
        dateRange.end,
    ]);

    // kpi cards
    const grossSalesFormatted = useMemo(
        () => formatMoney(sumBy(filtered, o => o.PRODUCT_SALES)),
        [filtered]
    );

    const unitsSoldFormatted = useMemo(
        () => sumBy(filtered, o => o.QUANTITY).toLocaleString(),
        [filtered]
    );

    const netTotalFormatted = useMemo(
        () => formatMoney(sumBy(filtered, o => o.TOTAL)),
        [filtered]
    );

    const totalTaxesFormatted = useMemo(() =>
        formatMoney(
            sumBy(ordersAll, o =>
                Object.entries(o || {})
                    .filter(([key]) => String(key).toUpperCase().endsWith("_TAX"))
                    .reduce((acc, [, value]) => acc + toNumber(value), 0)
            )),
        [ordersAll]
    );

    const totalFeesFormatted = useMemo(
        () =>
            formatMoney(
                sumBy(ordersAll, o =>
                    Math.abs(toNumber(o.SELLING_FEES)) +
                    Math.abs(toNumber(o.FBA_FEES)) +
                    Math.abs(toNumber(o.OTHER_TRANSACTION_FEES)) +
                    Math.abs(toNumber(o.OTHER)) +
                    Math.abs(toNumber(o.REGULATORY_FEE))
                )
            ),
        [ordersAll]
    );

    const statuses = useMemo(() => {
        const s = new Set((ordersAll || []).map(r => r?.STATUS || r?.status).filter(Boolean));
        return Array.from(s);
    }, [ordersAll]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                setError(null)

                const params = {
                    fecha_desde: fechaDesde,
                    fecha_hasta: fechaHasta
                }
                const all = await getOrdersSales(params)
                setOrdersAll(all || [])
            } catch (err) {
                console.error("Error fetching sales orders", err)
                setError(err?.message || 'Unknown error')
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [dateRange.start, dateRange.end, uploadedOrders.length, refresh])

    return (
        <div className="page">
            <div className="content-header">
                <h1>Sales Orders</h1>
                <p>Process and monitor Amazon orders transactions</p>
            </div>

            {/* Details */}
            <div className="kpi-cards">
                <KPICard title="Gross Sales" value={loading ? "—" : grossSalesFormatted} change="Total product sales" />
                <KPICard title="Units Sold" value={loading ? "—" : unitsSoldFormatted} change="Total units sold" />
                <KPICard title="Net Total" value={loading ? "—" : netTotalFormatted} change="Net sales total" />
                <KPICard title="Total Taxes" value={loading ? "—" : totalTaxesFormatted} change="Total taxes applied" />
                <KPICard title="Total Fees" value={loading ? "—" : totalFeesFormatted} change="Total fees applied" />
            </div>


            {/* Filters */}
            <OrdersFiltersBar
                statuses={statuses}
                value={{ from: dateRange.start, to: dateRange.end, search, status: statusFilter, settlementId: settlementIdFilter, orderId: orderIdFilter, sku: skuFilter, last: "30" }}
                onChange={(v) => {
                    setDateRange({ start: v.from, end: v.to });
                    setSearch(v.search);
                    setStatusFilter(v.status);
                    setSettlementIdFilter(v.settlementId);
                    setOrderIdFilter(v.orderId);
                    setSkuFilter(v.sku);
                    setPage(1);
                }}
                onApply={() => setPage(1)}
                onClear={() => {
                    setDateRange({ start: "", end: "" });
                    setSearch("");
                    setStatusFilter("");
                    setSettlementIdFilter("");
                    setOrderIdFilter("");
                    setSkuFilter("");
                    setPage(1);
                }}
            />

            {/* Table */}
            <div className="data-table">
                <div className="table-header">
                    <h3>Sales Orders</h3>
                    <div style={{ fontSize: 12, color: "#666" }}>
                        {loading ? "Loading..." : `${filtered.length} results`}
                    </div>
                </div>
                {uploadedOrders && uploadedOrders.length > 0 ? (
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
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <OrdersTableHeaders type="sales" />
                            <tbody>
                                <OrdersTableSkeleton
                                    loading={loading}
                                    dataLength={paginated.length}
                                    colSpan={12}
                                    rows={pageSize}
                                    emptyMessage="No sales orders found"
                                />

                                {!loading && paginated.length > 0 && (
                                    <OrdersTableBody rows={paginated} onView={setSelectedOrder} />
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Paginacion */}
            <div className="simple-pagination">
                <div className="simple-pagination-left">
                    <button
                        className="simple-pagination-btn"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="simple-pagination-btn"
                        onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                        disabled={page === pageCount}
                    >
                        Next
                    </button>
                </div>

                <div className="simple-pagination-info">
                    <span>Page <strong>{page}</strong> of {pageCount} •</span>
                    <select
                        className="simple-pagination-select"
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                    </select>
                </div>
            </div>
            {/* Charts */}
            <OrdersSalesCharts loading={loading} orders={filtered} />

            {/* Details */}
            {selectedOrder && (
                <SalesOrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

        </div>
    )
}

export default SalesOrders

import React, { useMemo, useState, useEffect, useRef } from "react";

import { useData } from "../../context/DataContext";
import { getOrdersSales } from "../../api/orders";

// Estilos
import "../../styles/dashboard.css";
import "../../styles/pagination.css";
import "../../styles/settlements-table.css";

// Table 
import OrdersTableBody from "../orders/OrdersTableBody";

// KPI Cards
import KPICard from "../common/KPICard";
import { pickKpiRows, buildSalesOrdersKpis } from "../../utils/kpicards";

// Details
import SalesOrderDetailsModal from "./OrdersDetailsModal";

// Charts
import OrdersSalesCharts from "../charts/Orders/OrdersSalesCharts";

// Filters
import OrdersFiltersBar from "../orders/OrdersFiltersBar";
import { filterSalesOrders } from "../../utils/salesOrdersFilters";

// Pagination
import { paginate } from "../../utils/pagination";

// Export PDF
import { exportRowsToPdf } from "../../utils/pdfExport/exportTableToPdf";
import { salesOrdersPdfColumns } from "../../utils/pdfExport/salesOrdersPdfColumns";

const DEFAULT_FROM = "2024-10-01";
const DEFAULT_TO = "2024-10-31";

const SalesOrders = () => {
    const [ordersAll, setOrdersAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [refresh, setRefresh] = useState(0);
    const [search, setSearch] = useState("");

    const fechaDesde = "10-01-2024";
    const fechaHasta = "10-31-2024";

    const [statusFilter, setStatusFilter] = useState("");
    const [dateRange, setDateRange] = useState({ start: DEFAULT_FROM, end: DEFAULT_TO });

    const { uploadedByPage } = useData();
    const uploadedOrders = (uploadedByPage && uploadedByPage.orders) || [];

    // details
    const [selectedOrder, setSelectedOrder] = useState(null);

    // extra filters
    const [settlementIdFilter, setSettlementIdFilter] = useState("");
    const [orderIdFilter, setOrderIdFilter] = useState("");
    const [skuFilter, setSkuFilter] = useState("");

    // pdf
    const chartsRef = useRef(null);

    // 1) FILTER
    const filtered = useMemo(() => {
        return filterSalesOrders(ordersAll, {
            search,
            status: statusFilter,
            settlementId: settlementIdFilter,
            orderId: orderIdFilter,
            sku: skuFilter,
            dateRange,
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

    // 2) PAGINATE
    const pagination = useMemo(
        () =>
            paginate({
                rows: filtered,
                page,
                pageSize,
            }),
        [filtered, page, pageSize]
    );

    const { page: safePage, totalItems, totalPages, visibleRows: paginated } = pagination;

    // keep state page in sync if paginate clamps it
    useEffect(() => {
        if (page !== safePage) setPage(safePage);
    }, [page, safePage]);

    // 3) KPI rows (PAGE == what you see)
    const KPI_MODE = "PAGE";
    const kpiRows = useMemo(
        () => pickKpiRows({ mode: KPI_MODE, paginated, filtered }),
        [KPI_MODE, paginated, filtered]
    );

    const kpis = useMemo(
        () => buildSalesOrdersKpis(kpiRows, { currency: "USD", locale: "en-US" }),
        [kpiRows]
    );

    // statuses for select
    const statuses = useMemo(() => {
        const s = new Set((ordersAll || []).map((r) => r?.STATUS || r?.status).filter(Boolean));
        return Array.from(s);
    }, [ordersAll]);

    const handleExportPdf = async () => {
        const headerBlocks = [
            { label: "Gross Sales", value: kpis.grossSales },
            { label: "Units Sold", value: kpis.unitsSold },
            { label: "Net Total", value: kpis.netTotal },
            { label: "Total Taxes", value: kpis.totalTaxes },
            { label: "Total Fees", value: kpis.totalFees },
        ];

        let chartImages = [];
        try {
            if (chartsRef.current?.getChartImages) {
                chartImages = await chartsRef.current.getChartImages();
            }
        } catch (e) {
            console.warn("Could not capture chart images:", e);
        }

        exportRowsToPdf({
            rows: paginated,
            columns: salesOrdersPdfColumns,
            title: `Sales Orders (${dateRange.start || "-"} → ${dateRange.end || "-"})`,
            fileName: `sales_orders_${dateRange.start || "from"}_${dateRange.end || "to"}_page_${safePage}.pdf`,
            orientation: "l",
            headerBlocks,
            footerNote: `View=PAGE | page=${safePage}/${totalPages} | pageSize=${pageSize} | status=${statusFilter || "ALL"} | search=${search || "-"}`,
            chartImages,
        });
    };

    // 4) FETCH
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    fecha_desde: fechaDesde,
                    fecha_hasta: fechaHasta,
                };

                const all = await getOrdersSales(params);
                setOrdersAll(all || []);
            } catch (err) {
                console.error("Error fetching sales orders", err);
                setError(err?.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [uploadedOrders.length, refresh]);

    return (
        <div className="page">
            <div className="content-header">
                <h1>Sales Orders</h1>
                <p>Process and monitor Amazon orders transactions</p>
            </div>

            {/* KPI Cards */}
            {paginated.length > 0 ?
                <div className="kpi-cards">
                    <KPICard title="Gross Sales" value={loading ? "—" : kpis.grossSales} change="Total product sales" />
                    <KPICard title="Units Sold" value={loading ? "—" : kpis.unitsSold} change="Total units sold" />
                    <KPICard title="Net Total" value={loading ? "—" : kpis.netTotal} change="Net sales total" />
                    <KPICard title="Total Taxes" value={loading ? "—" : kpis.totalTaxes} change="Total taxes applied" />
                    <KPICard title="Total Fees" value={loading ? "—" : kpis.totalFees} change="Total fees applied" />
                </div>
                : null}

            {/* Filters */}
            <OrdersFiltersBar
                statuses={statuses}
                value={{
                    from: dateRange.start,
                    to: dateRange.end,
                    search,
                    status: statusFilter,
                    settlementId: settlementIdFilter,
                    orderId: orderIdFilter,
                    sku: skuFilter,
                    last: "30",
                }}
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

            {/* Table  */}
            {paginated.length > 0 ?
                <OrdersTableBody
                    title="Sales Orders"
                    rows={paginated}
                    loading={loading}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onView={setSelectedOrder}
                    onExportPdf={handleExportPdf}
                />
                : null}

            {/* Pagination */}
            {paginated.length > 0 ?
                <div className="simple-pagination">
                    <div className="simple-pagination-left">
                        <button
                            className="simple-pagination-btn"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                        >
                            Previous
                        </button>
                        <button
                            className="simple-pagination-btn"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                        >
                            Next
                        </button>
                    </div>

                    <div className="simple-pagination-info">
                        <span>
                            Page <strong>{safePage}</strong> of {totalPages} •
                        </span>
                        <select
                            className="simple-pagination-select"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                        </select>
                    </div>
                </div>
                : null}

            {/* Charts  */}
            {paginated.length > 0 ? <OrdersSalesCharts ref={chartsRef} loading={loading} orders={paginated} /> : null}

            {/* Details */}
            {selectedOrder && <SalesOrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

            {error && (
                <div style={{ marginTop: 10, color: "#b00020", fontSize: 12 }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default SalesOrders;

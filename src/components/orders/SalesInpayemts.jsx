import React, { useMemo, useState, useEffect } from "react";
import { getOrdersPayments } from "../../api/orders";

// estilos
import "../../styles/dashboard.css";
import "../../styles/pagination.css";

// utils
import { formatMoney, toNumber } from "../../utils/refundMath";
import { netPaidForOrders, uniqueOrdersCount, principalTotal, amazonCommissionTotal, fbaFulfillmentFeesTotal, inDateRange } from "../../utils/paymentsMath";


// tabla
import OrdersTableHeaders from "../orders/OrdersTableHeaders";
import OrdersTableSkeleton from "../orders/OrdersTableSkeleton";
import OrdersTableBodyPayments from "../orders/OrdersTableBodyPayments";

// kpi cards 
import KPICard from "../common/KPICard";
import PaymentsDetailsModal from "./PaymentsDetailsModal";

// charts 
import OrdersPaymentsCharts from "../charts/Orders/OrdersPaymentsCharts";

// filters
import OrdersPaymentsFilters from "./OrdersPaymentsFilters";

const DEFAULT_FROM = "2024-10-01";
const DEFAULT_TO = "2024-10-31";

// helper: YYYY-MM-DD -> MM-DD-YYYY 
function formatToMMDDYYYY(value) {
    if (!value) return "";
    const parts = value.split("-");
    if (parts.length !== 3) return value;
    return `${parts[1]}-${parts[2]}-${parts[0]}`;
}

const SalesInpayemts = () => {
    const [paymentsAll, setPaymentsAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // filtros 
    const [dateRange, setDateRange] = useState({ start: DEFAULT_FROM, end: DEFAULT_TO });
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        start: DEFAULT_FROM,
        end: DEFAULT_TO,
        settlementId: "",
        orderId: "",
        sku: "",
        statuses: [],
        descriptions: [],
    });

    // paginación
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // details
    const [selectedPayment, setSelectedPayment] = useState(null);


    // filtro 
    const filtered = useMemo(() => {
        const q = (search || "").trim().toLowerCase();

        const start = filters.start || "";
        const end = filters.end || "";

        const settlementQ = (filters.settlementId || "").trim().toLowerCase();
        const orderQ = (filters.orderId || "").trim().toLowerCase();
        const skuQ = (filters.sku || "").trim().toLowerCase();

        const descSet = new Set(filters.descriptions || []);
        const statusSet = new Set(filters.statuses || []);

        return (paymentsAll || []).filter((p) => {
            const orderId = String(p.ORDER_ID || p.order_id || "");
            const sku = String(p.SKU || p.sku || "");
            const desc = String(p.AMOUNT_DESCRIPTION || p.description || "Unknown");
            const status = String(p.STATUS || p.status || "");
            const settlementId = String(p.SETTLEMENT_ID || p.settlement_id || "");

            // posted day (YYYY-MM-DD)
            const day =
                String(
                    p.POSTED_DATE_DATE ??
                    p.POSTED_DATE ??
                    p["POSTED_DATE_DATE"] ??
                    p["POSTED_DATE"] ??
                    ""
                ).slice(0, 10);

            // 1) rango fechas
            if (!inDateRange(day, start, end)) return false;

            // 2) settlement id
            if (settlementQ && !settlementId.toLowerCase().includes(settlementQ))
                return false;

            // 3) order id
            if (orderQ && !orderId.toLowerCase().includes(orderQ)) return false;

            // 4) sku
            if (skuQ && !sku.toLowerCase().includes(skuQ)) return false;

            // 5) AMOUNT_DESCRIPTION multi
            if (descSet.size > 0 && !descSet.has(desc)) return false;

            // 6) status (multi o single)
            if (statusSet.size > 0 && !statusSet.has(status)) return false;

            return (
                orderId.toLowerCase().includes(q) ||
                sku.toLowerCase().includes(q) ||
                desc.toLowerCase().includes(q) ||
                status.toLowerCase().includes(q) ||
                settlementId.toLowerCase().includes(q)
            );
        });
    }, [paymentsAll, search, filters]);


    const statusOptions = useMemo(() => {
        const set = new Set((paymentsAll || []).map((p) => String(p.STATUS || p.status || "").trim()).filter(Boolean));
        return Array.from(set).sort();
    }, [paymentsAll]);

    const descOptions = useMemo(() => {
        const set = new Set((paymentsAll || []).map((p) => String(p.AMOUNT_DESCRIPTION || p.description || "Unknown").trim()).filter(Boolean));
        return Array.from(set).sort();
    }, [paymentsAll]);


    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    // total
    const totalAmountFormatted = useMemo(() => {
        const total = (filtered || []).reduce((acc, p) => {
            const v =
                p.AMOUNT ??
                p["AMOUNT"] ??
                p["amount"] ??
                p.amount ??
                0;

            return acc + toNumber(v);
        }, 0);

        return formatMoney(total);
    }, [filtered]);

    // kpi cards
    const netPaidFormatted = useMemo(
        () => netPaidForOrders(filtered),
        [filtered]
    );

    const uniqueOrdersFormatted = useMemo(
        () => uniqueOrdersCount(filtered).toLocaleString(),
        [filtered]
    );

    const principalFormatted = useMemo(
        () => principalTotal(filtered),
        [filtered]
    );

    const amazonCommissionFormatted = useMemo(
        () => amazonCommissionTotal(filtered),
        [filtered]
    );

    const fbaFeesFormatted = useMemo(
        () => fbaFulfillmentFeesTotal(filtered),
        [filtered]
    );

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    fecha_desde: dateRange.start ? formatToMMDDYYYY(dateRange.start) : undefined,
                    fecha_hasta: dateRange.end ? formatToMMDDYYYY(dateRange.end) : undefined,
                };

                const all = await getOrdersPayments(params);
                console.log(all)
                setPaymentsAll(all || []);
                setPage(1);
            } catch (err) {
                console.error("Error fetching payments orders", err);
                setError(err?.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [dateRange.start, dateRange.end]);

    return (
        <div className="page">
            <div className="content-header">
                <h1>Inpayments Orders</h1>
                <p>Process and monitor Amazon payments transactions</p>
            </div>

            {/*  kpi cards */}
            <div className="kpi-cards">
                <KPICard title="Net Paid for Orders" value={loading ? "—" : netPaidFormatted} change="Total amount paid by Amazon" />
                <KPICard title="Orders (unique)" value={loading ? "—" : uniqueOrdersFormatted} change="Number of distinct orders" />
                <KPICard title="Principal" value={loading ? "—" : principalFormatted} change="Product sales amount" />
                <KPICard title="Amazon Commission" value={loading ? "—" : amazonCommissionFormatted} change="Amazon selling commissions" />
                <KPICard title="FBA Fulfillment Fees" value={loading ? "—" : fbaFeesFormatted} change="Fulfillment by Amazon fees" />
            </div>

            {/*  filters */}
            <OrdersPaymentsFilters
                value={{
                    from: filters.start,
                    to: filters.end,
                    orderId: filters.orderId,
                    sku: filters.sku,
                    status: filters.statuses,
                    descriptions: filters.descriptions,
                }}
                onChange={(v) => {
                    setFilters((f) => ({
                        ...f,
                        start: v.from,
                        end: v.to,
                        orderId: v.orderId,
                        sku: v.sku,
                        status: v.status,
                        descriptions: v.descriptions,
                    }));
                    setPage(1);
                }}
                onReset={() => {
                    setFilters({
                        start: DEFAULT_FROM,
                        end: DEFAULT_TO,
                        settlementId: "",
                        orderId: "",
                        sku: "",
                        statuses: [],
                        descriptions: [],
                    });
                    setPage(1);
                }}
                statusOptions={statusOptions}
                descOptions={descOptions}
            />

            {/* tabla */}
            <div className="data-table">
                <div className="table-header">
                    <h3>Inpayments</h3>
                    <div style={{ fontSize: 12, color: "#666", display: "flex", gap: 10 }}>
                        <span>{loading ? "Loading..." : `${filtered.length} results`}</span>
                        {!loading && <span>• Total: {totalAmountFormatted}</span>}
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <OrdersTableHeaders type="payments" />
                        <tbody>
                            <OrdersTableSkeleton
                                loading={loading}
                                dataLength={paginated.length}
                                colSpan={7}
                                rows={pageSize}
                                emptyMessage="No payments found"
                            />

                            {!loading && paginated.length > 0 && <OrdersTableBodyPayments rows={paginated} onView={setSelectedPayment} />}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* paginación  */}
            <div className="simple-pagination">
                <div className="simple-pagination-left">
                    <button
                        className="simple-pagination-btn"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="simple-pagination-btn"
                        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                        disabled={page === pageCount}
                    >
                        Next
                    </button>
                </div>

                <div className="simple-pagination-info">
                    <span>
                        Page <strong>{page}</strong> of {pageCount} •
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

            {/* charts */}
            <OrdersPaymentsCharts loading={loading} payments={filtered} />

            {error && (
                <div style={{ marginTop: 12, color: "crimson", fontSize: 12 }}>
                    {error}
                </div>
            )}

            {selectedPayment && (<PaymentsDetailsModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />)}

        </div>
    );
};

export default SalesInpayemts;

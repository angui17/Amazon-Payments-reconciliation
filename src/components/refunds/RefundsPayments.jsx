import React, { useEffect, useMemo, useState } from "react";
import { getRefundsPayments } from "../../api/refunds";

// utils
import { formatMoney, groupRefundsByDate } from "../../utils/refundMath";

// Estilos
import "../../styles/dashboard.css";
import "../../styles/charts.css";

// Table
import RefundsTableHeaders from "../refunds/RefundsTableHeaders";
import RefundsPaymentsRows from "../refunds/RefundsPaymentsRows";
import TableSkeletonOrEmpty from "../refunds/TableSkeletonOrEmpty";

// KPI cards 
import KPICard from "../common/KPICard";

// Details 
import PaymentDetailsModal from "../refunds/PaymentDetailsModal";

// charts
import PaymentsTimeline from "../charts/PaymentsTimeline";
import TopOrdersRefundBar from "../charts/TopOrdersRefundBar";
import PaymentsRefundBreakdown from "../charts/PaymentsRefundBreakdown";

// filters
import RefundsPaymentsFiltersBar from "../refunds/RefundsPaymentsFiltersBar";
import { dateToTs, dateToTsEnd } from "../../utils/dateUtils";

const RefundsPayments = () => {
    const fechaDesde = "10-01-2024";
    const fechaHasta = "10-31-2024";

    const [refundsAll, setRefundsAll] = useState([]);
    const [loading, setLoading] = useState(true);

    // filters
    const DEFAULT_FROM = "2024-10-01";
    const DEFAULT_TO = "2024-10-31";

    const [dateFrom, setDateFrom] = useState(DEFAULT_FROM);
    const [dateTo, setDateTo] = useState(DEFAULT_TO);

    const [settlementFilter, setSettlementFilter] = useState("");
    const [orderIdFilter, setOrderIdFilter] = useState("");
    const [skuFilter, setSkuFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [reasonFilters, setReasonFilters] = useState([]); // multi

    // details
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleOpenDetails = (p) => {
        setSelectedPayment(p);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedPayment(null);
    };

    // kpi cards
    const netRefundImpact = useMemo(() => {
        return refundsAll.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
    }, [refundsAll]);

    const principalRefunded = useMemo(() => {
        return refundsAll
            .filter(r => r.AMOUNT_DESCRIPTION === "Principal")
            .reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
    }, [refundsAll]);

    const refundCommission = useMemo(() => {
        return refundsAll
            .filter(r =>
                r.AMOUNT_DESCRIPTION === "Commission" ||
                r.AMOUNT_DESCRIPTION === "RefundCommission"
            )
            .reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
    }, [refundsAll]);

    const taxRefunded = useMemo(() => {
        return refundsAll
            .filter(r => r.AMOUNT_DESCRIPTION === "Tax")
            .reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
    }, [refundsAll]);

    // charts 
    const lineData = useMemo(() => {
        const map = new Map();

        for (const p of refundsAll) {
            const day = p.POSTED_DATE_DATE || p.POSTED_DATE;
            if (!day) continue;

            const amt = Number(p.amount) || 0;
            map.set(day, (map.get(day) || 0) + amt);
        }

        // formato típico para line charts: [{ date: "YYYY-MM-DD", value: number }]
        return Array.from(map.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, value]) => ({ date, value }));
    }, [refundsAll]);

    const topBarsData = useMemo(() => {
        const map = new Map();

        for (const p of refundsAll) {
            const key = p.ORDER_ID || p.order_id;
            if (!key) continue;

            const amt = Math.abs(Number(p.amount) || 0);
            map.set(key, (map.get(key) || 0) + amt);
        }

        return Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([orderId, total]) => ({ label: orderId, total }));
    }, [refundsAll]);

    const breakdownData = useMemo(() => {
        const map = new Map();

        for (const p of refundsAll) {
            const key = p.AMOUNT_DESCRIPTION || "Other";
            const amt = Math.abs(Number(p.amount) || 0);

            map.set(key, (map.get(key) || 0) + amt);
        }

        return Array.from(map.entries()).map(([label, total]) => ({
            label,
            total,
        }));
    }, [refundsAll]);


    // filters
    const reasonOptions = useMemo(() => {
        const set = new Set();
        for (const p of refundsAll) {
            if (p.AMOUNT_DESCRIPTION) set.add(p.AMOUNT_DESCRIPTION);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [refundsAll]);

    const paymentsFiltered = useMemo(() => {
        const fromTs = dateFrom ? dateToTs(dateFrom) : null;
        const toTs = dateTo ? dateToTsEnd(dateTo) : null;

        const norm = (v) => String(v ?? "").toLowerCase().trim();

        return refundsAll.filter((p) => {
            const posted = p.POSTED_DATE_DATE || p.POSTED_DATE; // "YYYY-MM-DD"
            const postedTs = posted ? dateToTs(posted) : null;

            const settlementId = p.SETTLEMENT_ID || p.settlementId || p.id || "";

            const matchFrom = !fromTs || (postedTs !== null && postedTs >= fromTs);
            const matchTo = !toTs || (postedTs !== null && postedTs <= toTs);

            const matchSettlement = !settlementFilter || norm(settlementId).includes(norm(settlementFilter));
            const matchOrder = !orderIdFilter || norm(p.ORDER_ID || p.order_id).includes(norm(orderIdFilter));
            const matchSku = !skuFilter || norm(p.sku || p.SKU).includes(norm(skuFilter));

            const st = String(p.status || p.STATUS || "");
            const matchStatus = !statusFilter || st === statusFilter;

            const reason = String(p.AMOUNT_DESCRIPTION || "");
            const matchReason = reasonFilters.length === 0 || reasonFilters.includes(reason);

            return matchFrom && matchTo && matchSettlement && matchOrder && matchSku && matchStatus && matchReason;
        });
    }, [refundsAll, dateFrom, dateTo, settlementFilter, orderIdFilter, skuFilter, statusFilter, reasonFilters]);

    const hasAnyFilter =
        Boolean(settlementFilter) ||
        Boolean(orderIdFilter) ||
        Boolean(skuFilter) ||
        Boolean(statusFilter) ||
        reasonFilters.length > 0 ||
        (dateFrom && dateFrom !== DEFAULT_FROM) ||
        (dateTo && dateTo !== DEFAULT_TO);

    const refundsToRender = useMemo(() => {
        return hasAnyFilter ? paymentsFiltered : paymentsFiltered.slice(0, 10);
    }, [hasAnyFilter, paymentsFiltered]);

    const base = paymentsFiltered;

    useEffect(() => {
        const fetchRefundsPayments = async () => {
            try {
                const data = await getRefundsPayments({
                    fecha_desde: fechaDesde,
                    fecha_hasta: fechaHasta,
                });
                setRefundsAll(data || []);
            } catch (error) {
                console.error("Error fetching payments refunds:", error);
                setRefundsAll([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRefundsPayments();
    }, []);

    return (
        <div className="main-content page active" id="refunds-page">
            <div className="content-header">
                <h1>Inpayments Refunds Management</h1>
                <p>Process and monitor Amazon refund transactions</p>
            </div>

            {/* KPI Cards */}
            <div className="kpi-cards">
                <KPICard title="Net Refund Impact" value={loading ? "—" : formatMoney(netRefundImpact)} change="Sum of amount" />
                <KPICard title="Principal refunded" value={loading ? "—" : formatMoney(principalRefunded)} change="Principal amount" />
                <KPICard title="Refund commission" value={loading ? "—" : formatMoney(refundCommission)} change="Commission refunds" />
                <KPICard title="Tax refunded" value={loading ? "—" : formatMoney(taxRefunded)} change="Tax refunds" />
            </div>

            {/* Filters */}
            <RefundsPaymentsFiltersBar
                from={dateFrom}
                to={dateTo}
                onFromChange={setDateFrom}
                onToChange={setDateTo}
                settlement={settlementFilter}
                onSettlementChange={setSettlementFilter}
                orderId={orderIdFilter}
                onOrderIdChange={setOrderIdFilter}
                sku={skuFilter}
                onSkuChange={setSkuFilter}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                reasons={reasonFilters}
                reasonOptions={reasonOptions}
                onReasonsChange={setReasonFilters}
                onClear={() => {
                    setDateFrom(DEFAULT_FROM);
                    setDateTo(DEFAULT_TO);
                    setSettlementFilter("");
                    setOrderIdFilter("");
                    setSkuFilter("");
                    setStatusFilter("");
                    setReasonFilters([]);
                }}
            />

            {/* Tabla */}
            <div className="data-table">
                <div className="table-header">
                    <h3>Refund Transactions</h3>
                </div>

                <div className="table-container">
                    <table>
                        <RefundsTableHeaders type="payments" />
                        <tbody>
                            <TableSkeletonOrEmpty
                                loading={loading}
                                dataLength={refundsToRender.length}
                                colSpan={10}
                                emptyMessage="No payments refunds found"
                            />

                            {!loading && refundsToRender.length > 0 && (
                                <RefundsPaymentsRows payments={refundsToRender} onDetails={handleOpenDetails} />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Línea: refund net por día */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <div className="chart-title">Net refund per day</div>
                            <div className="chart-subtitle">Line chart</div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="chart-skeleton chart-skeleton-line" />
                    ) : (
                        <div className="chart-inner">
                            <PaymentsTimeline data={lineData} />
                        </div>
                    )}
                </div>

                {/* Barras: top SKUs / Order IDs */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <div className="chart-title">Top SKUs / Order IDs</div>
                            <div className="chart-subtitle">Bar chart</div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="chart-skeleton chart-skeleton-bars" />
                    ) : (
                        <div className="chart-inner">
                            <TopOrdersRefundBar data={topBarsData} />
                        </div>
                    )}
                </div>

                {/* Doughnut: breakdown por amount-description */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <div className="chart-title">Refund breakdown</div>
                            <div className="chart-subtitle">By amount description</div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="chart-skeleton chart-skeleton-breakdown" />
                    ) : (
                        <div className="chart-inner">
                            <PaymentsRefundBreakdown data={breakdownData} />
                        </div>
                    )}
                </div>
            </div>


            {/* Details */}
            {isDetailsOpen && (
                <PaymentDetailsModal payment={selectedPayment} onClose={handleCloseDetails} />
            )}
        </div>
    );
};

export default RefundsPayments;

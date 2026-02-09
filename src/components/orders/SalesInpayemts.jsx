import React, { useMemo, useRef, useState, useEffect } from "react";
import { getOrdersPayments } from "../../api/orders";

// estilos
import "../../styles/dashboard.css";
import "../../styles/pagination.css";

// utils
import { formatMoney, toNumber } from "../../utils/refundMath"
import {
    filterOrdersPayments,
    getOrdersPaymentsOptions,
} from "../../utils/ordersPaymentsFilters";

// tabla
import OrdersPaymentsTable from "./inpayments/OrdersPaymentsTable";
// kpi cards
import OrdersPaymentsKpiCards from "./inpayments/OrdersPaymentsKpiCards";
//details
import PaymentsDetailsModal from "./PaymentsDetailsModal";

// charts
import OrdersPaymentsCharts from "../charts/Orders/OrdersPaymentsCharts";

// filters
import OrdersPaymentsFilters from "./OrdersPaymentsFilters";
// Pagination
import SimplePagination from "../common/SimplePagination";
import { paginate } from "../../utils/pagination";
//export to pdf
import { exportRowsToPdf } from "../../utils/pdfExport/exportTableToPdf";
import { ordersPaymentsPdfColumns } from "../../utils/pdfExport/ordersPaymentsPdfColumns";
import { buildOrdersPaymentsKpis } from "../../utils/kpicards";

const DEFAULT_FROM = "2024-10-01";
const DEFAULT_TO = "2024-10-31";

// helper: YYYY-MM-DD -> MM-DD-YYYY
function formatToMMDDYYYY(value) {
    if (!value) return "";
    const parts = value.split("-");
    if (parts.length !== 3) return value;
    return `${parts[1]}-${parts[2]}-${parts[0]}`;
}

const DEFAULT_FILTERS = {
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    settlementId: "",
    orderId: "",
    sku: "",
    statuses: [],
    amountDescription: "",
    search: "",
};

const SalesInpayemts = () => {
    const [paymentsAll, setPaymentsAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // draft vs applied 
    const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

    // paginación
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // details
    const [selectedPayment, setSelectedPayment] = useState(null);
    // export charts to pdf
    const chartsRef = useRef(null);

    // fetch (solo depende de applied from/to)
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    fecha_desde: appliedFilters.from
                        ? formatToMMDDYYYY(appliedFilters.from)
                        : undefined,
                    fecha_hasta: appliedFilters.to
                        ? formatToMMDDYYYY(appliedFilters.to)
                        : undefined,
                };

                const all = await getOrdersPayments(params);
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
    }, [appliedFilters.from, appliedFilters.to]);

    // options (status/desc)
    const { statuses: statusOptions, descriptions: descOptions } = useMemo(
        () => getOrdersPaymentsOptions(paymentsAll),
        [paymentsAll]
    );

    // filtered (limpio, testeable)
    const filtered = useMemo(() => {
        return filterOrdersPayments(paymentsAll, appliedFilters);
    }, [paymentsAll, appliedFilters]);

    // pagination
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

    useEffect(() => {
        if (page !== safePage) setPage(safePage);
    }, [page, safePage]);


    // total
    const totalAmountFormatted = useMemo(() => {
        const total = (filtered || []).reduce((acc, p) => {
            const v = p?.AMOUNT ?? p?.["AMOUNT"] ?? p?.amount ?? 0;
            return acc + toNumber(v);
        }, 0);

        return formatMoney(total);
    }, [filtered]);

    const handleExportPdf = async () => {
        const kpis = buildOrdersPaymentsKpis(paginated);

        const headerBlocks = [
            { label: "Net Paid", value: String(kpis.netPaid) },
            { label: "Orders (unique)", value: String(kpis.uniqueOrders) },
            { label: "Principal", value: String(kpis.principal) },
            { label: "Amazon Commission", value: String(kpis.amazonCommission) },
            { label: "FBA Fees", value: String(kpis.fbaFees) }
        ];

        await new Promise((r) => requestAnimationFrame(r));
        const chartImages = chartsRef.current?.getChartImages?.() || [];

        exportRowsToPdf({
            rows: paginated,
            columns: ordersPaymentsPdfColumns,
            title: `Inpayments Orders (${appliedFilters.from || "-"} → ${appliedFilters.to || "-"})`,
            fileName: `orders_inpayments_${appliedFilters.from || "from"}_${appliedFilters.to || "to"}_page_${safePage}.pdf`,
            orientation: "l",
            headerBlocks,
            chartImages,
            footerNote: `page=${safePage}/${totalPages} | pageSize=${pageSize} | total=${totalItems}`,
        });
    };

    return (
        <div className="page">
            <div className="content-header">
                <h1>Inpayments Orders</h1>
                <p>Process and monitor Amazon payments transactions</p>
            </div>

            {/* KPI */}
            <OrdersPaymentsKpiCards loading={loading} payments={paginated} />

            {/* Filters */}
            <OrdersPaymentsFilters
                value={{
                    from: draftFilters.from,
                    to: draftFilters.to,
                    settlementId: draftFilters.settlementId,
                    orderId: draftFilters.orderId,
                    sku: draftFilters.sku,
                    statuses: draftFilters.statuses,
                    amountDescription: draftFilters.amountDescription,
                    search: draftFilters.search,
                }}
                onChange={(v) => {
                    setDraftFilters((f) => ({
                        ...f,
                        ...v,
                    }));
                    setPage(1);
                }}
                onApply={() => {
                    setAppliedFilters(draftFilters);
                    setPage(1);
                }}
                onReset={() => {
                    setDraftFilters(DEFAULT_FILTERS);
                    setAppliedFilters(DEFAULT_FILTERS);
                    setPage(1);
                }}
                statusOptions={statusOptions}
                descOptions={descOptions}
            />

            {/* Table */}
            <OrdersPaymentsTable
                title="Inpayments"
                loading={loading}
                rows={paginated}
                totalItems={totalItems}
                totalAmount={totalAmountFormatted}
                pageSize={pageSize}
                onView={setSelectedPayment}
                onExportPdf={handleExportPdf}
            />

            {/* Pagination */}
            <SimplePagination
                page={safePage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(n) => {
                    setPageSize(n);
                    setPage(1);
                }}
                pageSizeOptions={[5, 10, 25]}
            />

            {/* Charts */}
            <OrdersPaymentsCharts loading={loading} payments={paginated} ref={chartsRef} />

            {error && (
                <div style={{ marginTop: 12, color: "crimson", fontSize: 12 }}>
                    {error}
                </div>
            )}

            {selectedPayment && (
                <PaymentsDetailsModal
                    payment={selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                />
            )}
        </div>
    );
};

export default SalesInpayemts;

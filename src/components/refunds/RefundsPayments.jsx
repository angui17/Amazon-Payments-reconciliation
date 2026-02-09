import React, { useEffect, useMemo, useState, useRef } from "react";
import { getRefundsPayments } from "../../api/refunds";

// Estilos
import "../../styles/dashboard.css";
import "../../styles/charts.css";
// Table
import RefundsPaymentsTable from "./inpayments/RefundsPaymentsTable";
// KPI cards
import RefundsPaymentsKpiCards from "./inpayments/RefundsPaymentsKpiCards";
import { buildRefundsPaymentsKpis } from "../../utils/kpicards";
// Details
import PaymentDetailsModal from "../refunds/PaymentDetailsModal";
// Charts
import RefundsPaymentsCharts from "./inpayments/RefundsPaymentsCharts";
// Filters
import RefundsPaymentsFiltersBar from "../refunds/RefundsPaymentsFiltersBar";
import { filterRefundsPayments, getRefundsPaymentsOptions } from "../../utils/refundsPaymentsFilters";
// Pagination
import SimplePagination from "../common/SimplePagination";
import { paginate } from "../../utils/pagination";
// export to pdf
import { exportRowsToPdf } from "../../utils/pdfExport/exportTableToPdf";
import { refundsPaymentsPdfColumns } from "../../utils/pdfExport/refundsPaymentsPdfColumns";

const DEFAULT_FROM = "2024-10-01";
const DEFAULT_TO = "2024-10-31";

const DEFAULT_FILTERS = {
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    settlement: "",
    orderId: "",
    sku: "",
    status: "",
    reason: "",
};

const RefundsPayments = () => {
    const fechaDesde = "10-01-2024";
    const fechaHasta = "10-31-2024";

    const [refundsAll, setRefundsAll] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ draft/applied
    const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

    // pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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

    // options (status/reasons)
    const { statuses: statusOptions, reasons: reasonOptions } = useMemo(() => {
        return getRefundsPaymentsOptions(refundsAll);
    }, [refundsAll]);

    // filtered usa appliedFilters
    const paymentsFiltered = useMemo(() => {
        return filterRefundsPayments(refundsAll, appliedFilters);
    }, [refundsAll, appliedFilters]);

    // hay filtros activos? (se chequea sobre applied)
    const hasAnyFilter = useMemo(() => {
        const f = appliedFilters;

        return (
            Boolean(f.settlement) ||
            Boolean(f.orderId) ||
            Boolean(f.sku) ||
            Boolean(f.status) ||
            Boolean(f.reason) ||
            (f.from && f.from !== DEFAULT_FROM) ||
            (f.to && f.to !== DEFAULT_TO)
        );
    }, [appliedFilters]);

    // si NO hay filtros → muestro 10
    const baseRows = useMemo(() => {
        return hasAnyFilter ? paymentsFiltered : paymentsFiltered.slice(0, 10);
    }, [hasAnyFilter, paymentsFiltered]);

    // paginate baseRows
    const pagination = useMemo(
        () =>
            paginate({
                rows: baseRows,
                page,
                pageSize,
            }),
        [baseRows, page, pageSize]
    );

    const { page: safePage, totalItems, visibleRows: refundsToRender } = pagination;

    // keep safe page if rows/pageSize changed
    useEffect(() => {
        if (page !== safePage) setPage(safePage);
    }, [page, safePage]);

    // fetch
    useEffect(() => {
        const fetchRefundsPayments = async () => {
            try {
                setLoading(true);
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


    const chartsRef = useRef(null);
    const handleExportPdf = async () => {
        const kpis = buildRefundsPaymentsKpis(refundsToRender);

        const headerBlocks = [
            { label: "Net Refund Impact", value: String(kpis?.netRefundImpact ?? "—") },
            { label: "Principal refunded", value: String(kpis?.principalRefunded ?? "—") },
            { label: "Refund commission", value: String(kpis?.refundCommission ?? "—") },
            { label: "Tax refunded", value: String(kpis?.taxRefunded ?? "—") },
        ];
         await new Promise((r) => requestAnimationFrame(r));
  const chartImages = chartsRef.current?.getChartImages?.() || [];
        exportRowsToPdf({
            rows: refundsToRender,
            columns: refundsPaymentsPdfColumns,
            title: `Refund Payments (${appliedFilters.from || "-"} → ${appliedFilters.to || "-"})`,
            fileName: `refund_payments_${appliedFilters.from || "from"}_${appliedFilters.to || "to"}_page_${safePage}.pdf`,
            orientation: "l",
            headerBlocks,
            chartImages,
            footerNote: `page=${safePage} | pageSize=${pageSize} | total=${totalItems}`,
        });
    };


    return (
        <div className="main-content page active" id="refunds-page">
            <div className="content-header">
                <h1>Inpayments Refunds Management</h1>
                <p>Process and monitor Amazon refund transactions</p>
            </div>

            {/* KPI Cards */}
            {refundsToRender.length > 0 ? <RefundsPaymentsKpiCards loading={loading} refunds={refundsToRender} /> : null}

            {/* Filters */}
            <RefundsPaymentsFiltersBar
                value={draftFilters}
                onChange={(v) => setDraftFilters(v)}
                onApply={() => {
                    setAppliedFilters(draftFilters);
                    setPage(1);
                }}
                onClear={() => {
                    setDraftFilters(DEFAULT_FILTERS);
                    setAppliedFilters(DEFAULT_FILTERS);
                    setPage(1);
                }}
                statusOptions={statusOptions}
                reasonOptions={reasonOptions}
            />

            {/* Table */}
            {refundsToRender.length > 0 ?
                <RefundsPaymentsTable
                    title="Refund Transactions"
                    loading={loading}
                    rows={refundsToRender}
                    totalItems={totalItems}
                    onDetails={handleOpenDetails}
                    onExportPdf={handleExportPdf}
                />
                : <div className="text-center">No refund payments found for the selected criteria.</div>
            }

            {/* Pagination */}
            {refundsToRender.length > 0 ?
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
                : null}

            {/* Charts */}
            {refundsToRender.length > 0 ?
                <RefundsPaymentsCharts ref={chartsRef} loading={loading} refunds={refundsToRender} />
                : null}

            {/* Details */}
            {isDetailsOpen && (
                <PaymentDetailsModal payment={selectedPayment} onClose={handleCloseDetails} />
            )}
        </div>
    );
};

export default RefundsPayments;

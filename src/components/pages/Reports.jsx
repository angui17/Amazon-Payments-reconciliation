import React, { useEffect, useMemo, useState, useRef } from "react";
import "../../styles/dashboard.css";

import { getReports } from "../../api/reports";
import { ymdToMdy } from "../../utils/dateUtils";
import { calculateSummary } from "../../utils/reportsSummary";

// kpi cards
import ReportsKpiCards from "../reports/ReportsKpiCards";
import ReportsKpiCardsSkeleton from "../reports/ReportsKpiCardsSkeleton";

// table
import ReportsMonthlyTableSkeleton from "../reports/ReportsMonthlyTableSkeleton";
import ReportsMonthlyTable from "../reports/ReportsMonthlyTable";

// filters
import ReportsFilters from "../reports/ReportsFilters";
import { effectiveStatusFromReconciledCount } from "../../utils/settlementsTableUtils";

// pagination
import SimplePagination from "../common/SimplePagination";
import MonthlyReconciliationCharts from "../reports/MonthlyReconciliationCharts";
import { paginate } from "../../utils/pagination";

// export to pdf
import { exportRowsToPdf } from "../../utils/pdfExport/exportTableToPdf";
import { reportsMonthlyPdfColumns } from "../../utils/pdfExport/reportsPDFColumns";
import { buildReportsPdfKpiBlocks } from "../../utils/reportsPdfKpis";

const DEFAULT_FROM = "2024-01-01";
const DEFAULT_TO = "2026-01-31";
const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_FILTERS = {
  fecha_desde: DEFAULT_FROM,
  fecha_hasta: DEFAULT_TO,
  pending: "ALL",
  status: "ALL",
  limit_months: 12,
};

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [allRows, setAllRows] = useState([]);
  const [charts, setCharts] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);

  const chartsRef = useRef(null);

  // ✅ params: NO mandamos pending al backend (solo fechas/limit)
  const params = useMemo(
    () => ({
      fecha_desde: ymdToMdy(applied.fecha_desde),
      fecha_hasta: ymdToMdy(applied.fecha_hasta),
      limit_months: Number(applied.limit_months),
    }),
    [applied.fecha_desde, applied.fecha_hasta, applied.limit_months]
  );

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      setSummary(null);
      setCharts(null);

      const res = await getReports(params);

      setSummary(res?.summary ?? null);

      const rows = Array.isArray(res?.rows) ? res.rows : [];
      setAllRows(rows);
      setCharts(res?.charts ?? null);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Error fetching reports");
      setSummary(null);
      setAllRows([]);
      setCharts(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [params]);

  const filteredRows = useMemo(() => {
    const rows = Array.isArray(allRows) ? allRows : [];
    let out = rows;

    // A) filtro por pendingCount (1..5)
    if (applied.pending && applied.pending !== "ALL") {
      const target = Number(applied.pending);
      out = out.filter((r) => Number(r?.pendingCount) === target);
    }

    // B) filtro por estado (C/P) basado en reconciledCount
    if (applied.status && applied.status !== "ALL") {
      const want = String(applied.status).toUpperCase(); // "C" | "P"
      out = out.filter((r) => {
        const st = effectiveStatusFromReconciledCount(r?.reconciledCount);
        return st === want;
      });
    }

    return out;
  }, [allRows, applied.pending, applied.status]);

  const totalItems = filteredRows.length;
  const { visibleRows, page: safePage } = useMemo(
    () =>
      paginate({
        rows: filteredRows,
        page,
        pageSize,
      }),
    [filteredRows, page, pageSize]
  );

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  const handleApply = () => {
    setApplied(filters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
  };

  const handlePageChange = (nextPage) => setPage(nextPage);

  const handlePageSizeChange = (nextSize) => {
    setPageSize(nextSize);
    setPage(1);
  };

  const pageSummary = useMemo(() => calculateSummary(visibleRows), [visibleRows]);
  const totalSummary = useMemo(() => calculateSummary(filteredRows), [filteredRows]);

  const pendingLabel = applied.pending === "ALL" ? "All" : applied.pending;

  return (
    <div className="main-content page active" id="reports-page">
      <div className="content-header">
        <h1>Reports & Analytics</h1>
        <p>Generate and view reconciliation reports</p>
      </div>

      {error ? <div className="orders-empty">{error}</div> : null}

      {/* KPI cards */}
      {loading ? (
        <ReportsKpiCardsSkeleton count={5} />
      ) : pageSummary ? (
        <ReportsKpiCards summary={pageSummary} totalSummary={totalSummary} />
      ) : null}

      {/* Filters */}
      <ReportsFilters
        filters={filters}
        onChange={setFilters}
        onApply={handleApply}
        onReset={handleReset}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
      />

      {/* Table */}
      {loading ? (
        <ReportsMonthlyTableSkeleton rows={6} cols={10} />
      ) : visibleRows.length === 0 ? (
        <div className="orders-empty">No records found for the selected filters.</div>
      ) : (
        <>
          <ReportsMonthlyTable
            rows={visibleRows}
            onViewDetails={(row) => console.log("DETAIL ROW:", row)}

            onExportPdf={async () => {
              const headerBlocks = buildReportsPdfKpiBlocks(pageSummary, totalSummary);
              await new Promise((r) => requestAnimationFrame(r));

              const chartImages = chartsRef.current?.getChartImages?.() || [];
              const statusLabel = applied.status === "ALL" ? "All" : applied.status;

              exportRowsToPdf({
                rows: visibleRows,
                columns: reportsMonthlyPdfColumns,
                title: "Reports (Monthly)",
                fileName: "reports-monthly-page.pdf",
                orientation: "l",
                headerBlocks,
                chartImages,
                footerNote: `Filters — From: ${applied.fecha_desde} · To: ${applied.fecha_hasta} · Pending: ${pendingLabel} · Status: ${statusLabel}`,
              });
            }}
          />

          <SimplePagination
            page={page}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 25, 50]}
          />
        </>
      )}

      {/* charts */}
      {!loading && totalItems > 0 ? (
        <MonthlyReconciliationCharts ref={chartsRef} charts={charts} loading={loading} />
      ) : null}
    </div>
  );
};

export default Reports;

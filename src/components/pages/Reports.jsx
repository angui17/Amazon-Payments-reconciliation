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
  status: "ALL",
  limit_months: 12,
};

const Reports = () => {
  // data
  const [summary, setSummary] = useState(null);
  // rows
  const [allRows, setAllRows] = useState([]);
  // charts
  const [charts, setCharts] = useState(null);
  // pagination
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  // ui
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // filters
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);
  // pdf
  const chartsRef = useRef(null);

  // params 
  const params = useMemo(
    () => ({
      fecha_desde: ymdToMdy(applied.fecha_desde),
      fecha_hasta: ymdToMdy(applied.fecha_hasta),
      status: applied.status,
      limit_months: Number(applied.limit_months),
    }),
    [applied]
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
      setTotalItems(rows.length);
      setCharts(res?.charts ?? null);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Error fetching reports");
      setSummary(null);
      setAllRows([]);
      setTotalItems(0);
      setCharts(null);
    } finally {
      setLoading(false);
    }
  };

  // fetch cuando cambian filtros aplicados
  useEffect(() => {
    fetchReports();
  }, [params]);

  useEffect(() => {
    const { page: safePage } = paginate({
      rows: allRows,
      page,
      pageSize,
    });

    if (safePage !== page) setPage(safePage);
  }, [allRows, pageSize]);


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

  const { visibleRows, totalPages } = useMemo(
    () =>
      paginate({
        rows: allRows,
        page,
        pageSize,
      }),
    [allRows, page, pageSize]
  );

  const pageSummary = useMemo(
    () => calculateSummary(visibleRows),
    [visibleRows]
  );

  const totalSummary = useMemo(
    () => calculateSummary(allRows),
    [allRows]
  );

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
        <div className="orders-empty">
          No records found for the selected filters.
        </div>
      ) : (
        <>
          <ReportsMonthlyTable
            rows={visibleRows}
            onViewDetails={(row) => console.log("DETAIL ROW:", row)}
            onExportPdf={async () => {
              const headerBlocks = buildReportsPdfKpiBlocks(pageSummary, totalSummary);
              await new Promise((r) => requestAnimationFrame(r));

              const chartImages = chartsRef.current?.getChartImages?.() || [];

              exportRowsToPdf({
                rows: visibleRows,
                columns: reportsMonthlyPdfColumns,
                title: "Reports (Monthly)",
                fileName: "reports-monthly-page.pdf",
                orientation: "l",
                headerBlocks,
                chartImages,
                footerNote: `Filters — From: ${applied.fecha_desde} · To: ${applied.fecha_hasta} · Status: ${applied.status}`,
              });
            }}
          />

          {/* Pagination */}
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
      {!loading && totalItems > 0 ? (<MonthlyReconciliationCharts ref={chartsRef} charts={charts} loading={loading} />) : null}
    </div>
  );
};

export default Reports;
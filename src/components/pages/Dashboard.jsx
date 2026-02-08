import React, { useEffect, useState, useRef } from 'react'
import { getDashboard } from '../../api/dashboard'

// exportacion a pdf
import { exportRowsToPdf } from "../../utils/pdfExport/exportTableToPdf";
import { settlementsPdfColumns } from "../../utils/pdfExport/dashboardPDFColumns";

import {
  buildDashboardSummaryFromRows,
  buildDashboardPdfKpiBlocks
} from "../../utils/dashboardKpiSummary";

// kpi cards
import DashboardKPIs from "../dashboard/DashboardKPIs";

// charts
import DashboardCharts from "../dashboard/DashboardCharts";

// filtros por defecto
import DashboardFilters from "../dashboard/DashboardFilters";
import { ymdToMdy } from "../../utils/dateUtils";

// paginacion
import SimplePagination from "../common/SimplePagination";

const DEFAULT_FILTERS = {
  fecha_desde: "2025-01-01",
  fecha_hasta: "2026-01-31",
  status: "ALL",
  limit_records: 50,
};

const DEFAULT_PAGE_SIZE = 10;

// Table
import SettlementsTable from "../dashboard/SettlementsTable";
import SettlementsTableSkeleton from "../dashboard/SettlementsTableSkeleton";

// details
import SettlementDetailsModal from "../dashboard/SettlementDetailsModal";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // kpi cards
  const [summary, setSummary] = useState(null);
  // charts 
  const [charts, setCharts] = useState(null);
  //filters
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  // table
  const [rows, setRows] = useState(null);
  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // details 
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // pdf 
  const chartsRef = useRef(null);

  const toApiFilters = (f) => ({
    ...f,
    fecha_desde: ymdToMdy(f.fecha_desde), //  MM-DD-YYYY
    fecha_hasta: ymdToMdy(f.fecha_hasta), // MM-DD-YYYY
  });

  const fetchDashboard = async (f) => {
    setLoading(true);
    setError("");
    setSummary(null);
    setCharts(null);

    try {
      const apiFilters = toApiFilters(f);
      const resp = await getDashboard(apiFilters);
      setSummary(resp.summary);
      setCharts(resp.charts);
      setRows(resp.rows || []);
    } catch (e) {
      setError(e.message || "Error fetching dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
    fetchDashboard(nextFilters);
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
    fetchDashboard(DEFAULT_FILTERS);
  };

  useEffect(() => {
    fetchDashboard(filters);
  }, [])

  const getRowStatus = (r) => {
    const raw = r?.status ?? r?.STATUS ?? r?.Status ?? "";
    return String(raw).toUpperCase();
  };

  const allRows = rows || [];

  // 1) status filter
  const statusFiltered =
    filters.status === "ALL"
      ? allRows
      : allRows.filter((r) => getRowStatus(r) === String(filters.status).toUpperCase());

  // 2) limit_records
  const limitN = Math.max(1, Number(filters.limit_records) || 50);
  const filteredRows = statusFiltered.slice(0, limitN);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  const pagedRows = filteredRows.slice(start, end);

  // paginacion
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((filteredRows?.length || 0) / pageSize));
    if (page > totalPages) setPage(1);
  }, [filteredRows.length, pageSize]);

  return (
    <>
      <div className="content-header">
        <h1>Reconciliation Dashboard</h1>
        <p>Overview of Amazon Payments reconciliation status</p>
      </div>

      {/* KPI charts */}
      {pagedRows.length > 0 ? <DashboardKPIs summary={summary} rows={pagedRows} /> : null}

      {/* Filters */}
      <DashboardFilters
        value={filters}
        onApply={handleApply}
        onClear={handleClear}
      />

      {error ? (
        <div className="card" style={{ padding: 16 }}>
          <strong>Oops:</strong> {error}
        </div>
      ) : null}

      {/* Tables */}
      {rows === null ? (
        <SettlementsTableSkeleton rows={6} />
      ) : filteredRows.length === 0 ? (
        <div className="orders-empty">
          No records found for the selected filters.
        </div>
      ) : (
        <SettlementsTable
          rows={pagedRows}
          onDetails={(row) => {
            setSelectedRow(row);
            setDetailsOpen(true);
          }}
          onExportPdf={async () => {
            const pageSummary = buildDashboardSummaryFromRows(pagedRows);
            const headerBlocks = buildDashboardPdfKpiBlocks(pageSummary);
            await new Promise((r) => requestAnimationFrame(r));

            const chartImages = chartsRef.current?.getChartImages?.() || [];
            exportRowsToPdf({
              rows: pagedRows,
              columns: settlementsPdfColumns,
              title: "Dashboard Settlements",
              fileName: "dashboard-page.pdf",
              headerBlocks,
              chartImages,
            });
          }}

        />
      )}

      {/* Pagination */}
      {rows !== null && totalItems > 0 ? (
        <SimplePagination
          page={safePage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(n) => {
            setPageSize(n);
            setPage(1);
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      ) : null}


      {/* Charts */}
      {pagedRows.length > 0 ? <DashboardCharts ref={chartsRef} charts={charts} rows={pagedRows} /> : null}

      <SettlementDetailsModal
        open={detailsOpen}
        row={selectedRow}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  )
}

export default Dashboard
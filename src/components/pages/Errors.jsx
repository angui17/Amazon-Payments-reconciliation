import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, } from 'react';
// Estilos
import '../../styles/dashboard.css';
// info
import { getErrors, getErrorsSummary279 } from '../../api/error';
import { ymdToMdy } from "../../utils/dateUtils";

// details 
import ErrorsDetailsModal from "../errors/ErrorsDetailsModal";

const DEFAULT_FILTERS = {
  fecha_desde: "2024-01-01",
  fecha_hasta: "2026-01-31",
  status: "ALL",
  limit_records: 50,
};

// kpi cards
import ErrorsKPIs from "../errors/ErrorsKPIs";

// table
import ErrorsTable from "../errors/ErrorsTable";
import ErrorsTableSkeleton from "../errors/ErrorsTableSkeleton";
import ErrorsCharts from '../errors/ErrorsCharts';

// filters
import ErrorsFilters from "../errors/ErrorsFilters";

// Export to pdf
import { exportRowsToPdf } from "../../utils/pdfExport/exportTableToPdf";
import { errorsPdfColumns } from "../../utils/pdfExport/errorsPdfColumns";
import { buildErrorsHeaderBlocks } from "../../utils/errorsKpis";

const Errors = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // kpi cards 
  const [summary267, setSummary267] = useState(null);
  const [summary279, setSummary279] = useState(null);


  // table
  const [rows, setRows] = useState(null);

  // details
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // charts
  const [charts, setCharts] = useState(null);

  // pdf
  const chartsRef = useRef(null);

  // filters
  const toApiFilters = (ui) => ({
    ...ui,
    fecha_desde: ymdToMdy(ui.fecha_desde),
    fecha_hasta: ymdToMdy(ui.fecha_hasta),
  });

  const handleApply = () => {
    if (!canApply) return;

    onApply({
      ...draft,
      limit_records: draft.limit_records === "" ? 50 : draft.limit_records,
      status: draft.status || "ALL",
    });
  };

  const handleApplyFilters = (nextUiFilters) => {
    setFilters(nextUiFilters);
    fetchErrors(nextUiFilters);
  };

  const fetchErrors = async (uiFilters) => {
    setLoading(true);
    setSummary267(null);
    setSummary279(null);
    setRows(null);
    setCharts(null);

    try {
      const apiFilters = toApiFilters(uiFilters);

      const [resp267, resp279] = await Promise.all([
        getErrors(apiFilters),
        getErrorsSummary279(apiFilters),
      ]);

      setSummary267(resp267.summary);
      setRows(resp267.rows || []);
      setCharts(resp267.charts);
      setSummary279(resp279.summary);
    } catch (e) {
      console.error("Error fetching errors:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors(filters);
  }, [])

  const getRowStatus = (r) =>
    String(r?.status ?? r?.STATUS ?? "").trim().toUpperCase();

  // 1) status
  const statusFiltered = (rows || []).filter((r) => {
    const s = getRowStatus(r);
    if (filters.status === "ALL") return true;
    return s === String(filters.status).toUpperCase();
  });

  // 2) limit_records 
  const limitN = Math.max(1, Number(filters.limit_records) || 50);
  const filteredRows = statusFiltered.slice(0, limitN);

  const handleExportPdf = async () => {
    // 1) KPIs 
    const headerBlocks = buildErrorsHeaderBlocks(filteredRows);

    // 2) Charts images 
    let chartImages = [];
    try {
      if (chartsRef.current?.getChartImages) {
        chartImages = await chartsRef.current.getChartImages();
      }
    } catch (e) {
      console.warn("Could not capture chart images:", e);
    }

    exportRowsToPdf({
      rows: filteredRows,
      columns: errorsPdfColumns,
      title: `Error Management (${filters.fecha_desde} → ${filters.fecha_hasta})`,
      fileName: `errors_${filters.fecha_desde}_${filters.fecha_hasta}.pdf`,
      orientation: "l",
      headerBlocks,
      footerNote: `Status filter: ${filters.status} | Limit: ${filters.limit_records}`,
      chartImages,
    });
  };


  return (
    <div className="main-content page active" id="errors-page">
      <div className="content-header">
        <h1>Error Management</h1>
        <p>Identify and resolve reconciliation errors</p>
      </div>

      {/* KPi cards */}
      {filteredRows.length > 0 ? <ErrorsKPIs rows={filteredRows} summary267={summary267} summary279={summary279} loading={loading} /> : null}

      {/*  filters */}
      <ErrorsFilters value={filters} defaultValue={DEFAULT_FILTERS} onApply={handleApplyFilters} loading={loading} />

      {/* table */}
      {loading || rows === null ? (
        <ErrorsTableSkeleton rows={6} />
      ) : (
        filteredRows.length > 0 ? (
          <ErrorsTable
            rows={filteredRows}
            onDetails={(row) => { setSelectedRow(row); setDetailsOpen(true) }}
            onExportPdf={handleExportPdf}

          />
        ) : (
          <div className="no-results text-center">No results for current filters</div>
        )
      )}

      {/* charts */}
      {filteredRows.length > 0
        ? <ErrorsCharts rows={filteredRows} charts={charts} loading={loading} ref={chartsRef} />
        : null}

      {/* Modal details */}
      <ErrorsDetailsModal open={detailsOpen} row={selectedRow} onClose={() => setDetailsOpen(false)} />
    </div>
  );
};

export default Errors;
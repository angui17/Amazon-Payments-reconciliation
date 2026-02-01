import React, { useEffect, useState } from 'react';
import '../../styles/dashboard.css';
import { getErrors, getErrorsSummary279 } from '../../api/error';

import { isEmptySummary } from '../../utils/isEmptySummary';
import { ymdToMdy } from "../../utils/dateUtils";

// details 
import ErrorsDetailsModal from "../errors/ErrorsDetailsModal";

const DEFAULT_FILTERS = {
  fecha_desde: "2024-01-01",
  fecha_hasta: "2025-01-31",
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

      const resp267 = await getErrors(apiFilters);
      setSummary267(resp267.summary);
      setRows(resp267.rows || []);
      setCharts(resp267.charts);

      if (isEmptySummary(resp267?.summary)) {
        const resp279 = await getErrorsSummary279(apiFilters);
        setSummary279(resp279.summary);
      } else {
        setSummary279(null);
      }
    } catch (e) {
      console.error("Error fetching errors:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors(filters);
  }, []);

  return (
    <div className="main-content page active" id="errors-page">
      <div className="content-header">
        <h1>Error Management</h1>
        <p>Identify and resolve reconciliation errors</p>
      </div>

      {/* KPi cards */}
      <ErrorsKPIs summary267={summary267} summary279={summary279} loading={loading} />

      {/*  filters */}
      <ErrorsFilters value={filters} onApply={handleApplyFilters} loading={loading} />

      {/* table */}
      {loading || rows === null ? (
        <ErrorsTableSkeleton rows={6} />
      ) : (
        <ErrorsTable rows={rows} onDetails={(row) => { setSelectedRow(row), setDetailsOpen(true) }} />)}

      {/* charts */}
      <ErrorsCharts charts={charts} loading={loading} />

      {/* Modal details */}
      <ErrorsDetailsModal open={detailsOpen} row={selectedRow} onClose={() => setDetailsOpen(false)} />
    </div>
  );
};

export default Errors;
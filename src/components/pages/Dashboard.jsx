import React, { useEffect, useState } from 'react'
import { getDashboard } from '../../api/dashboard'

// kpi cards
import DashboardKPIs from "../dashboard/DashboardKPIs";

// charts
import DashboardCharts from "../dashboard/DashboardCharts";

// filtros por defecto
import DashboardFilters from "../dashboard/DashboardFilters";
import { ymdToMdy } from "../../utils/dateUtils";

const DEFAULT_FILTERS = {
  fecha_desde: "2025-01-01",
  fecha_hasta: "2026-01-31",
  status: "ALL",
  limit_records: 50,
};

// Table
import SettlementsTable from "../dashboard/SettlementsTable";
import SettlementsTableSkeleton from "../dashboard/SettlementsTableSkeleton";

// details
import SettlementDetailsModal from "../dashboard/SettlementDetailsModal";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);   // kpi cards
  const [charts, setCharts] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState(null); // table

  // details 
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
    fetchDashboard(nextFilters);
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


  return (
    <>
      <div className="content-header">
        <h1>Reconciliation Dashboard</h1>
        <p>Overview of Amazon Payments reconciliation status</p>
      </div>

      {/* KPI charts */}
      {filteredRows.length > 0 ? <DashboardKPIs summary={summary} rows={filteredRows} /> : null}

      {/* Filters */}
      <DashboardFilters value={filters} onApply={handleApply} />

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
          rows={filteredRows}
          onDetails={(row) => {
            setSelectedRow(row);
            setDetailsOpen(true);
          }}
        />
      )}


      {/* Charts */}
      {filteredRows.length > 0 ? <DashboardCharts charts={charts} rows={filteredRows} /> : null}

      <SettlementDetailsModal
        open={detailsOpen}
        row={selectedRow}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  )
}

export default Dashboard
import React, { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard.css";

import { getReports } from "../../api/reports";
import { ymdToMdy } from "../../utils/dateUtils";

// kpi cards
import ReportsKpiCards from "../reports/ReportsKpiCards";
import ReportsKpiCardsSkeleton from "../reports/ReportsKpiCardsSkeleton";

// table
import ReportsMonthlyTableSkeleton from "../reports/ReportsMonthlyTableSkeleton";
import ReportsMonthlyTable from "../reports/ReportsMonthlyTable";

// filters
import ReportsFilters from "../reports/ReportsFilters";

const DEFAULT_FROM = "2024-01-01";
const DEFAULT_TO = "2025-01-30";

const DEFAULT_FILTERS = {
  fecha_desde: DEFAULT_FROM,
  fecha_hasta: DEFAULT_TO,
  status: "ALL",
  limit_months: 12,
  top_causes_n: 10,
};

const Reports = () => {
  // data
  const [summary, setSummary] = useState(null);
  const [monthlyRows, setMonthlyRows] = useState([]);

  // ui
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filters: editable vs applied
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);

  // params that go to API 
  const params = useMemo(
    () => ({
      fecha_desde: ymdToMdy(applied.fecha_desde),
      fecha_hasta: ymdToMdy(applied.fecha_hasta),
      status: applied.status,
      limit_months: Number(applied.limit_months),
      top_causes_n: Number(applied.top_causes_n),
      limit_records: 50,
    }),
    [applied]
  );

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getReports(params);

      setSummary(res?.summary ?? null);
      setMonthlyRows(Array.isArray(res?.rows) ? res.rows : []);

      console.log("reports res:", res);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Error fetching reports");
      setSummary(null);
      setMonthlyRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [params]);

  const handleApply = () => setApplied(filters);

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
  };

  return (
    <div className="main-content page active" id="reports-page">
      <div className="content-header">
        <h1>Reports & Analytics</h1>
        <p>Generate and view reconciliation reports</p>
      </div>

      {/* KPI cards */}
      {loading ? (
        <ReportsKpiCardsSkeleton count={5} />
      ) : summary ? (
        <ReportsKpiCards summary={summary} />
      ) : (
        <div style={{ padding: 12 }}>
          {error ? `⚠️ ${error}` : "No summary data"}
        </div>
      )}

      {/* Filters */}
      <ReportsFilters
        filters={filters}
        onChange={setFilters}
        onApply={handleApply}
        onReset={handleReset}
        loading={loading}
      />

      {/* Table */}
      {loading ? (
        <ReportsMonthlyTableSkeleton rows={6} cols={10} />
      ) : (
        <ReportsMonthlyTable
          rows={monthlyRows}
          onViewDetails={(row) => console.log("DETAIL ROW:", row)}
        />
      )}
    </div>
  );
};

export default Reports;

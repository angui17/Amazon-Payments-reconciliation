import React, { useEffect, useState } from 'react';
import '../../styles/dashboard.css';

import { getReports } from '../../api/reports';
import { ymdToMdy } from '../../utils/dateUtils';

// kpi cards
import ReportsKpiCards from "../reports/ReportsKpiCards";
import ReportsKpiCardsSkeleton from "../reports/ReportsKpiCardsSkeleton";

//table
import ReportsMonthlyTableSkeleton from '../reports/ReportsMonthlyTableSkeleton';
import ReportsMonthlyTable from '../reports/ReportsMonthlyTable';

const Reports = () => {
  // kpi cards
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  //table
  const [monthlyRows, setMonthlyRows] = useState([]);

  const DEFAULT_FROM = "2024-01-01";
  const DEFAULT_TO = "2025-01-30";

  const DEFAULT_PARAMS = ({
    fecha_desde: ymdToMdy(DEFAULT_FROM),
    fecha_hasta: ymdToMdy(DEFAULT_TO),
    limit_records: 50,
    status: "ALL",
  })

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getReports(DEFAULT_PARAMS);
      setSummary(res?.summary ?? null);
      setMonthlyRows(res?.rows ?? null);

      console.log(res)
    } catch (error) {
      console.error(e);
      setError(e?.message || "Error fetching reports");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <div className="main-content page active" id="reports-page">
      <div className="content-header">
        <h1>Reports & Analytics</h1>
        <p>Generate and view reconciliation reports</p>
      </div>

      {/* kpi cards */}
      {loading ? (
        <ReportsKpiCardsSkeleton count={5} />
      ) : summary ? (
        <ReportsKpiCards summary={summary} />
      ) : (
        <div style={{ padding: 12 }}>
          {error ? `⚠️ ${error}` : "No summary data"}
        </div>
      )}
      {/*  filters */}

      {/*  table */}
      {loading ? (
        <ReportsMonthlyTableSkeleton rows={6} cols={10} />
      ) : (
        <ReportsMonthlyTable
          rows={monthlyRows}
          onViewDetails={(row) => console.log("DETAIL ROW:", row)}
        />
      )}
      {/*  charts */}

      {/*  details */}


      {/* <div className="charts-row">
        <div className="chart-container">
          <div className="chart-title">Custom Report Builder</div>
          <div className="chart-placeholder">
            <div style={{ textAlign: 'center' }}>
              <h3>Build Custom Report</h3>
              <p>Select data sources, filters, and output format</p>
              <button className="btn btn-primary" style={{ marginTop: '15px' }}>
                <span>📊</span> Start Building
              </button>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-title">Report Usage Statistics</div>
          <div className="chart-placeholder">Bar Chart: Most frequently accessed reports</div>
        </div>
      </div> */}
    </div>
  );
};

export default Reports;
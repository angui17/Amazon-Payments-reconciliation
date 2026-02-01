import React, { useEffect, useState } from 'react';
import '../../styles/dashboard.css';

import { getReports } from '../../api/reports';
import { ymdToMdy } from '../../utils/dateUtils';

// kpi cards
import ReportsKpiCards from "../reports/ReportsKpiCards";
import ReportsKpiCardsSkeleton from "../reports/ReportsKpiCardsSkeleton";

const Reports = () => {
  // kpi cards
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState("");

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
      setLoadingSummary(true);
      setError("");
      const res = await getReports(DEFAULT_PARAMS);
      setSummary(res?.summary ?? null);
      console.log(res)
    } catch (error) {
      console.error(e);
      setError(e?.message || "Error fetching reports");
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  }

  const reports = [
    {
      name: 'Daily Reconciliation Summary',
      type: 'Summary',
      frequency: 'Daily',
      lastGenerated: '2025-09-20 08:00',
      status: 'Active'
    },
    {
      name: 'Monthly SAP vs Amazon Variance',
      type: 'Analytical',
      frequency: 'Monthly',
      lastGenerated: '2025-09-01 00:00',
      status: 'Active'
    },
    {
      name: 'Payment Exception Report',
      type: 'Exception',
      frequency: 'Weekly',
      lastGenerated: '2025-09-15 00:00',
      status: 'Active'
    },
    {
      name: 'Refund Analysis',
      type: 'Analytical',
      frequency: 'On Demand',
      lastGenerated: '2025-09-18 14:30',
      status: 'Draft'
    }
  ];


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
{loadingSummary ? (
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

      {/*  charts */}

      {/*  details */}

    

      <div className="data-table">
        <div className="table-header">
          <h3>Report Templates</h3>
          <div className="table-actions">
            <button className="btn btn-outline">Schedule Report</button>
            <button className="btn btn-primary">Create New</button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Frequency</th>
                <th>Last Generated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.name}</td>
                  <td>{report.type}</td>
                  <td>{report.frequency}</td>
                  <td>{report.lastGenerated}</td>
                  <td>
                    <span className={`status-badge status-${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button className="action-btn action-view">View</button>
                    <button className="action-btn action-edit">Run Now</button>
                    <button className="action-btn action-edit">Export</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-row">
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
      </div>
    </div>
  );
};

export default Reports;
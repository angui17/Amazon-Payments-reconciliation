import React, { useEffect } from 'react';
import '../../styles/dashboard.css';
import { getErrors, getErrorsSummary279 } from '../../api/error';
import { isEmptySummary } from '../../utils/isEmptySummary';
import { ymdToMdy } from "../../utils/dateUtils";

const DEFAULT_FILTERS = {
  fecha_desde: "2025-01-01",
  fecha_hasta: "2025-01-31",
  status: "ALL",
  limit_records: 50,
};

const Errors = () => {

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const apiFilters = {
          ...DEFAULT_FILTERS,
          fecha_desde: ymdToMdy(DEFAULT_FILTERS.fecha_desde),
          fecha_hasta: ymdToMdy(DEFAULT_FILTERS.fecha_hasta),
        };

        const resp267 = await getErrors(apiFilters);
        console.log("ERRORS WS 267:", resp267);

        if (isEmptySummary(resp267?.summary)) {
          const resp279 = await getErrorsSummary279(apiFilters);
          console.log("WS 279 (fallback):", resp279);
        }

      } catch (e) {
        console.error("Error fetching errors:", e);
      }
    };

    fetchErrors();
  }, []);



  return (
    <div className="main-content page active" id="errors-page">
      <div className="content-header">
        <h1>Error Management</h1>
        <p>Identify and resolve reconciliation errors</p>
      </div>

      <div className="kpi-cards">
        <div className="kpi-card">
          <div>Total Errors</div>
          <div className="kpi-value">47</div>
          <div className="kpi-label">Active issues</div>
        </div>
        <div className="kpi-card">
          <div>Critical</div>
          <div className="kpi-value">12</div>
          <div className="kpi-label">Require immediate attention</div>
        </div>
        <div className="kpi-card">
          <div>Resolved Today</div>
          <div className="kpi-value">8</div>
          <div className="kpi-label">Successfully fixed</div>
        </div>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h3>Error Log</h3>
          <div className="table-actions">
            <button className="btn btn-outline">Export Log</button>
            <button className="btn btn-primary">Bulk Resolve</button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Error ID</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Description</th>
                <th>Source</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="checkbox" /></td>
                <td>ERR-2025-00456</td>
                <td>Data Validation</td>
                <td><span className="status-badge status-error">Critical</span></td>
                <td>Invalid order amount format</td>
                <td>Amazon API</td>
                <td>2025-09-20 10:15</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">Details</button>
                  <button className="action-btn action-edit">Resolve</button>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" /></td>
                <td>ERR-2025-00457</td>
                <td>Connection</td>
                <td><span className="status-badge status-error">Critical</span></td>
                <td>SAP DI API timeout</td>
                <td>SAP Integration</td>
                <td>2025-09-20 09:45</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">Details</button>
                  <button className="action-btn action-edit">Resolve</button>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" /></td>
                <td>ERR-2025-00458</td>
                <td>File Processing</td>
                <td><span className="status-badge status-warning">Warning</span></td>
                <td>Missing required columns in CSV</td>
                <td>File Upload</td>
                <td>2025-09-20 09:30</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">Details</button>
                  <button className="action-btn action-edit">Resolve</button>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" /></td>
                <td>ERR-2025-00459</td>
                <td>Data Mapping</td>
                <td><span className="status-badge status-info">Info</span></td>
                <td>Currency conversion rate missing</td>
                <td>Payment Processing</td>
                <td>2025-09-19 16:20</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">Details</button>
                  <button className="action-btn action-edit">Resolve</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-title">Errors by Category</div>
          <div className="chart-placeholder">Bar Chart: Error distribution by type</div>
        </div>
        <div className="chart-container">
          <div className="chart-title">Error Trend</div>
          <div className="chart-placeholder">Line Chart: Daily error occurrences</div>
        </div>
      </div>
    </div>
  );
};

export default Errors;
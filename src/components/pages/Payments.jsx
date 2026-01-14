import React from 'react';
import '../../styles/dashboard.css';

const Payments = () => {
  return (
    <div className="main-content page active" id="payments-page">
      <div className="content-header">
        <h1>Payment Reconciliation</h1>
        <p>Manage payment settlements and drafts</p>
      </div>

      <div className="kpi-cards">
        <div className="kpi-card">
          <div>Settlement Reports</div>
          <div className="kpi-value">45</div>
          <div className="kpi-label">This month</div>
        </div>
        <div className="kpi-card">
          <div>Payment Drafts</div>
          <div className="kpi-value">128</div>
          <div className="kpi-label">Created</div>
        </div>
        <div className="kpi-card">
          <div>Reconciled</div>
          <div className="kpi-value">$45,127</div>
          <div className="kpi-label">Total amount</div>
        </div>
      </div>

      <div className="reserve-accounts">
        <div className="table-header">
          <h3>Reserve Account Balances</h3>
          <div className="table-actions">
            <button className="btn btn-outline">Export</button>
            <button className="btn btn-primary">Refresh</button>
          </div>
        </div>
        
        <div className="reserve-cards">
          <div className="reserve-card">
            <div className="reserve-label">Reserve Amount</div>
            <div className="reserve-value">$5,250.00</div>
            <div className="reserve-period">September 2025</div>
          </div>
          <div className="reserve-card">
            <div className="reserve-label">Current Reserve Amount</div>
            <div className="reserve-value">$3,200.00</div>
            <div className="reserve-period">September 2025</div>
          </div>
          <div className="reserve-card">
            <div className="reserve-label">Total Reserve Balance</div>
            <div className="reserve-value">$8,450.00</div>
            <div className="reserve-period">September 2025</div>
          </div>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h4>Accounting Entries - Reserve Accounts</h4>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Period</th>
                  <th>Initial Balance</th>
                  <th>Current Reserve Amount</th>
                  <th>Ending Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2105 - Amazon Reserve Account</td>
                  <td>Sep 2025</td>
                  <td>$4,850.00</td>
                  <td>$400.00</td>
                  <td>$5,250.00</td>
                  <td><span className="status-badge status-success">Reconciled</span></td>
                </tr>
                <tr>
                  <td>2110 - Current Reserve Amount</td>
                  <td>Sep 2025</td>
                  <td>$3,149.75</td>
                  <td>$50.25</td>
                  <td>$3,200.00</td>
                  <td><span className="status-badge status-success">Reconciled</span></td>
                </tr>
                <tr>
                  <td>2105 - Amazon Reserve Account</td>
                  <td>Aug 2025</td>
                  <td>$4,500.00</td>
                  <td>$350.00</td>
                  <td>$4,850.00</td>
                  <td><span className="status-badge status-success">Reconciled</span></td>
                </tr>
                <tr>
                  <td>2110 - Current Reserve Amount</td>
                  <td>Aug 2025</td>
                  <td>$2,950.00</td>
                  <td>$199.75</td>
                  <td>$3,149.75</td>
                  <td><span className="status-badge status-success">Reconciled</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-title">Payment Processing Timeline</div>
          <div className="chart-placeholder">Timeline of payment processing stages</div>
        </div>
        <div className="chart-container">
          <div className="chart-title">Settlement Status</div>
          <div className="chart-placeholder">Pie chart: Processed vs Pending</div>
        </div>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h3>Settlement Reports</h3>
          <div className="table-actions">
            <button className="btn btn-primary">Upload Report</button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Period</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Processed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SETTLEMENT_12345</td>
                <td>Sep 1-7, 2025</td>
                <td>$12,456.78</td>
                <td><span className="status-badge status-success">Completed</span></td>
                <td>2025-09-08</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">View</button>
                  <button className="action-btn action-edit">Download</button>
                </td>
              </tr>
              <tr>
                <td>SETTLEMENT_12346</td>
                <td>Sep 8-14, 2025</td>
                <td>$15,230.11</td>
                <td><span className="status-badge status-pending">Processing</span></td>
                <td>2025-09-15</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">View</button>
                  <button className="action-btn action-edit">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
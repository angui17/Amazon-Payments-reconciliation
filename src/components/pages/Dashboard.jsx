import React from 'react';

const Dashboard = () => {
  return (
    <>
      <div className="content-header">
        <h1>Reconciliation Dashboard</h1>
        <p>Overview of Amazon Payments reconciliation status</p>
      </div>

      <div className="kpi-cards">
        <div className="kpi-card">
          <div>Total Invoices</div>
          <div className="kpi-value">1,247</div>
          <div className="kpi-label">+12% from last week</div>
        </div>
        <div className="kpi-card">
          <div>Pending Payments</div>
          <div className="kpi-value">48</div>
          <div className="kpi-label">5 require attention</div>
        </div>
        <div className="kpi-card">
          <div>Errors Detected</div>
          <div className="kpi-value">12</div>
          <div className="kpi-label">3 critical</div>
        </div>
      </div>

      {/* Accounting Summary Section */}
      <div className="accounting-summary">
        <div className="table-header">
          <h3>Accounting Summary by Account</h3>
          <div className="table-actions">
            <button className="btn btn-outline">Export</button>
            <button className="btn btn-primary">Refresh</button>
          </div>
        </div>
        
        <div className="account-cards">
          <div className="account-card">
            <div className="account-name">Accounts Receivable</div>
            <div className="account-value">$45,127.50</div>
            <div className="account-change positive">+$2,458.75</div>
          </div>
          <div className="account-card">
            <div className="account-name">Sales Revenue</div>
            <div className="account-value">$89,456.25</div>
            <div className="account-change positive">+$5,782.30</div>
          </div>
          <div className="account-card">
            <div className="account-name">Amazon Fees</div>
            <div className="account-value">$12,458.75</div>
            <div className="account-change negative">+$1,245.80</div>
          </div>
          <div className="account-card">
            <div className="account-name">Reserve Accounts</div>
            <div className="account-value">$8,450.00</div>
            <div className="account-change positive">+$450.25</div>
          </div>
        </div>

        <div className="account-table">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Account Code</th>
                  <th>Account Name</th>
                  <th>Current Balance</th>
                  <th>Previous Balance</th>
                  <th>Change</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1100</td>
                  <td>Accounts Receivable - Amazon</td>
                  <td>$45,127.50</td>
                  <td>$42,668.75</td>
                  <td className="positive">+$2,458.75</td>
                  <td><span className="status-badge status-success">Balanced</span></td>
                </tr>
                <tr>
                  <td>4100</td>
                  <td>Sales Revenue - Amazon</td>
                  <td>$89,456.25</td>
                  <td>$83,673.95</td>
                  <td className="positive">+$5,782.30</td>
                  <td><span className="status-badge status-success">Balanced</span></td>
                </tr>
                <tr>
                  <td>5100</td>
                  <td>Amazon Marketplace Fees</td>
                  <td>$12,458.75</td>
                  <td>$11,212.95</td>
                  <td className="negative">+$1,245.80</td>
                  <td><span className="status-badge status-success">Balanced</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-title">Daily Reconciliation Trend</div>
          <div className="chart-placeholder">Line Chart: Daily processed items</div>
        </div>
        <div className="chart-container">
          <div className="chart-title">Amazon vs SAP Discrepancies</div>
          <div className="chart-placeholder">Bar Chart: Amount differences by category</div>
        </div>
      </div>

      <div className="alerts-section">
        <h3>Recent Alerts</h3>
        <div className="alert-item alert-critical">
          <div className="alert-icon">⚠</div>
          <div className="alert-content">
            <div className="alert-title">Failed CSV Upload - Invalid format</div>
            <div className="alert-time">10 minutes ago</div>
          </div>
        </div>
        <div className="alert-item alert-critical">
          <div className="alert-icon">⚠</div>
          <div className="alert-content">
            <div className="alert-title">SAP Connection Timeout</div>
            <div className="alert-time">25 minutes ago</div>
          </div>
        </div>
        <div className="alert-item">
          <div className="alert-icon">ℹ</div>
          <div className="alert-content">
            <div className="alert-title">Amazon API quota nearing limit</div>
            <div className="alert-time">1 hour ago</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
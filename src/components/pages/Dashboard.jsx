// import React from 'react';

// const Dashboard = () => {
//   return (
//     <>
//       <div className="content-header">
//         <h1>Reconciliation Dashboard</h1>
//         <p>Overview of Amazon Payments reconciliation status</p>
//       </div>

//       <div className="kpi-cards">
//         <div className="kpi-card">
//           <div>Total Invoices</div>
//           <div className="kpi-value">1,247</div>
//           <div className="kpi-label">+12% from last week</div>
//         </div>
//         <div className="kpi-card">
//           <div>Pending Payments</div>
//           <div className="kpi-value">48</div>
//           <div className="kpi-label">5 require attention</div>
//         </div>
//         <div className="kpi-card">
//           <div>Errors Detected</div>
//           <div className="kpi-value">12</div>
//           <div className="kpi-label">3 critical</div>
//         </div>
//       </div>

//       {/* Accounting Summary Section */}
//       <div className="accounting-summary">
//         <div className="table-header">
//           <h3>Accounting Summary by Account</h3>
//           <div className="table-actions">
//             <button className="btn btn-outline">Export</button>
//             <button className="btn btn-primary">Refresh</button>
//           </div>
//         </div>
        
//         <div className="account-cards">
//           <div className="account-card">
//             <div className="account-name">Accounts Receivable</div>
//             <div className="account-value">$45,127.50</div>
//             <div className="account-change positive">+$2,458.75</div>
//           </div>
//           <div className="account-card">
//             <div className="account-name">Sales Revenue</div>
//             <div className="account-value">$89,456.25</div>
//             <div className="account-change positive">+$5,782.30</div>
//           </div>
//           <div className="account-card">
//             <div className="account-name">Amazon Fees</div>
//             <div className="account-value">$12,458.75</div>
//             <div className="account-change negative">+$1,245.80</div>
//           </div>
//           <div className="account-card">
//             <div className="account-name">Reserve Accounts</div>
//             <div className="account-value">$8,450.00</div>
//             <div className="account-change positive">+$450.25</div>
//           </div>
//         </div>

//         <div className="account-table">
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Account Code</th>
//                   <th>Account Name</th>
//                   <th>Current Balance</th>
//                   <th>Previous Balance</th>
//                   <th>Change</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>1100</td>
//                   <td>Accounts Receivable - Amazon</td>
//                   <td>$45,127.50</td>
//                   <td>$42,668.75</td>
//                   <td className="positive">+$2,458.75</td>
//                   <td><span className="status-badge status-success">Balanced</span></td>
//                 </tr>
//                 <tr>
//                   <td>4100</td>
//                   <td>Sales Revenue - Amazon</td>
//                   <td>$89,456.25</td>
//                   <td>$83,673.95</td>
//                   <td className="positive">+$5,782.30</td>
//                   <td><span className="status-badge status-success">Balanced</span></td>
//                 </tr>
//                 <tr>
//                   <td>5100</td>
//                   <td>Amazon Marketplace Fees</td>
//                   <td>$12,458.75</td>
//                   <td>$11,212.95</td>
//                   <td className="negative">+$1,245.80</td>
//                   <td><span className="status-badge status-success">Balanced</span></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <div className="charts-row">
//         <div className="chart-container">
//           <div className="chart-title">Daily Reconciliation Trend</div>
//           <div className="chart-placeholder">Line Chart: Daily processed items</div>
//         </div>
//         <div className="chart-container">
//           <div className="chart-title">Amazon vs SAP Discrepancies</div>
//           <div className="chart-placeholder">Bar Chart: Amount differences by category</div>
//         </div>
//       </div>

//       <div className="alerts-section">
//         <h3>Recent Alerts</h3>
//         <div className="alert-item alert-critical">
//           <div className="alert-icon">⚠</div>
//           <div className="alert-content">
//             <div className="alert-title">Failed CSV Upload - Invalid format</div>
//             <div className="alert-time">10 minutes ago</div>
//           </div>
//         </div>
//         <div className="alert-item alert-critical">
//           <div className="alert-icon">⚠</div>
//           <div className="alert-content">
//             <div className="alert-title">SAP Connection Timeout</div>
//             <div className="alert-time">25 minutes ago</div>
//           </div>
//         </div>
//         <div className="alert-item">
//           <div className="alert-icon">ℹ</div>
//           <div className="alert-content">
//             <div className="alert-title">Amazon API quota nearing limit</div>
//             <div className="alert-time">1 hour ago</div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;

import React from 'react'
import KPICard from '../common/KPICard'

const Dashboard = () => {
  const kpiData = [
    { title: 'Total Invoices', value: '1,247', change: '+12% from last week', trend: 'up' },
    { title: 'Pending Payments', value: '48', change: '5 require attention', trend: 'warning' },
    { title: 'Errors Detected', value: '12', change: '3 critical', trend: 'down' },
    { title: 'Success Rate', value: '96.5%', change: '+2.3% from yesterday', trend: 'up' }
  ]

  const alerts = [
    { id: 1, title: 'Failed CSV Upload - Invalid format', time: '10 minutes ago', critical: true },
    { id: 2, title: 'SAP Connection Timeout', time: '25 minutes ago', critical: true },
    { id: 3, title: 'Amazon API quota nearing limit', time: '1 hour ago', critical: false }
  ]

  return (
    <>
      <div className="content-header">
        <h1>Reconciliation Dashboard</h1>
        <p>Overview of Amazon Payments reconciliation status</p>
      </div>

      <div className="kpi-cards">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
          />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="grid-column">
          <div className="card">
            <div className="card-header">
              <h3>Daily Reconciliation Trend</h3>
              <button className="btn btn-sm btn-outline">View Details</button>
            </div>
            <div className="chart-placeholder">
              <div className="placeholder-content">
                <span>📈</span>
                <p>Line chart showing daily trends</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Recent Alerts</h3>
              <span className="badge badge-warning">{alerts.length} active</span>
            </div>
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.critical ? 'critical' : ''}`}>
                  <div className="alert-icon">{alert.critical ? '⚠️' : 'ℹ️'}</div>
                  <div className="alert-content">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-time">{alert.time}</div>
                  </div>
                  <button className="btn btn-sm btn-outline">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid-column">
          <div className="card">
            <div className="card-header">
              <h3>Top Customers by Volume</h3>
              <select className="select-sm">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Quarter</option>
              </select>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Orders</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Amazon US</td>
                    <td>425</td>
                    <td>$45,127.50</td>
                    <td><span className="status-badge status-success">Active</span></td>
                  </tr>
                  <tr>
                    <td>Amazon CA</td>
                    <td>198</td>
                    <td>$21,450.25</td>
                    <td><span className="status-badge status-success">Active</span></td>
                  </tr>
                  <tr>
                    <td>Amazon UK</td>
                    <td>156</td>
                    <td>$18,230.75</td>
                    <td><span className="status-badge status-warning">Delayed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Processing Pipeline</h3>
              <div className="progress-text">65% Complete</div>
            </div>
            <div className="pipeline-steps">
              <div className="step active">
                <div className="step-number">1</div>
                <div className="step-content">
                  <div className="step-title">File Upload</div>
                  <div className="step-status">Completed</div>
                </div>
              </div>
              <div className="step active">
                <div className="step-number">2</div>
                <div className="step-content">
                  <div className="step-title">Data Validation</div>
                  <div className="step-status">In Progress</div>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <div className="step-title">Reconciliation</div>
                  <div className="step-status">Pending</div>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <div className="step-title">Report Generation</div>
                  <div className="step-status">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
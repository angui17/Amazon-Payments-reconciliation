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
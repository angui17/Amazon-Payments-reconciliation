import React from 'react';
import '../../styles/dashboard.css';

const Refunds = () => {
  return (
    <div className="main-content page active" id="refunds-page">
      <div className="content-header">
        <h1>Refunds Management</h1>
        <p>Process and monitor Amazon refund transactions</p>
      </div>

      <div className="kpi-cards">
        <div className="kpi-card">
          <div>Total Refunds</div>
          <div className="kpi-value">156</div>
          <div className="kpi-label">This month</div>
        </div>
        <div className="kpi-card">
          <div>Processed</div>
          <div className="kpi-value">142</div>
          <div className="kpi-label">91% success rate</div>
        </div>
        <div className="kpi-card">
          <div>Pending</div>
          <div className="kpi-value">14</div>
          <div className="kpi-label">Awaiting processing</div>
        </div>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h3>Refund Transactions</h3>
          <div className="table-actions">
            <button className="btn btn-outline">Export</button>
            <button className="btn btn-primary">Process Refunds</button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Refund ID</th>
                <th>Order ID</th>
                <th>SKU</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="checkbox" /></td>
                <td>RF-2025-00123</td>
                <td>123-4567890-1234567</td>
                <td>
                  <div>PROD-12345-BLUE-L</div>
                  <div className="sku-details">
                    <div className="sku-info">
                      <span className="sku-label">Product:</span>
                      <span className="sku-value">Premium T-Shirt</span>
                    </div>
                    <div className="sku-info">
                      <span className="sku-label">Reason:</span>
                      <span className="sku-value">Size too large</span>
                    </div>
                  </div>
                </td>
                <td>-$25.99</td>
                <td>Customer Return</td>
                <td><span className="status-badge status-success">Completed</span></td>
                <td>2025-09-18</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">View</button>
                  <button className="action-btn action-edit">Reprocess</button>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" /></td>
                <td>RF-2025-00124</td>
                <td>123-9876543-2109876</td>
                <td>
                  <div>PROD-67890-RED-M</div>
                  <div className="sku-details">
                    <div className="sku-info">
                      <span className="sku-label">Product:</span>
                      <span className="sku-value">Classic Hoodie</span>
                    </div>
                    <div className="sku-info">
                      <span className="sku-label">Reason:</span>
                      <span className="sku-value">Damaged item</span>
                    </div>
                  </div>
                </td>
                <td>-$45.50</td>
                <td>Damaged Item</td>
                <td><span className="status-badge status-pending">Processing</span></td>
                <td>2025-09-19</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">View</button>
                  <button className="action-btn action-edit">Reprocess</button>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" /></td>
                <td>RF-2025-00125</td>
                <td>123-1111111-4444444</td>
                <td>
                  <div>PROD-55555-BLACK-XL</div>
                  <div className="sku-details">
                    <div className="sku-info">
                      <span className="sku-label">Product:</span>
                      <span className="sku-value">Athletic Shorts</span>
                    </div>
                    <div className="sku-info">
                      <span className="sku-label">Reason:</span>
                      <span className="sku-value">Wrong item shipped</span>
                    </div>
                  </div>
                </td>
                <td>-$32.50</td>
                <td>Wrong Item Shipped</td>
                <td><span className="status-badge status-error">Failed</span></td>
                <td>2025-09-19</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">View</button>
                  <button className="action-btn action-edit">Reprocess</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-title">Refunds by Reason</div>
          <div className="chart-placeholder">Pie Chart: Distribution of refund reasons</div>
        </div>
        <div className="chart-container">
          <div className="chart-title">Refund Processing Timeline</div>
          <div className="chart-placeholder">Line Chart: Daily refund processing volume</div>
        </div>
      </div>
    </div>
  );
};

export default Refunds;
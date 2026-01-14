import React from 'react';
import '../../styles/dashboard.css';

const Fees = () => {
  return (
    <div className="main-content page active" id="fees-page">
      <div className="content-header">
        <h1>Fees Management</h1>
        <p>View and manage Amazon fees and charges</p>
      </div>

      <div className="kpi-cards">
        <div className="kpi-card">
          <div>Total Fees</div>
          <div className="kpi-value">$2,458</div>
          <div className="kpi-label">This month</div>
        </div>
        <div className="kpi-card">
          <div>Fees Processed</div>
          <div className="kpi-value">$2,312</div>
          <div className="kpi-label">94% reconciled</div>
        </div>
        <div className="kpi-card">
          <div>Pending Fees</div>
          <div className="kpi-value">$146</div>
          <div className="kpi-label">Awaiting processing</div>
        </div>
      </div>

      <div className="fee-breakdown">
        <h3>Fee Breakdown</h3>
        <div className="fee-category">
          <h4>Amazon Marketplace Fees</h4>
          <div className="fee-item">
            <span className="fee-name">Referral Fee</span>
            <span className="fee-amount">$1,245.80</span>
          </div>
          <div className="fee-item">
            <span className="fee-name">Variable Closing Fee</span>
            <span className="fee-amount">$245.25</span>
          </div>
          <div className="fee-item">
            <span className="fee-name">Subscription Fee</span>
            <span className="fee-amount">$39.99</span>
          </div>
        </div>

        <div className="fee-category">
          <h4>Fulfillment by Amazon (FBA) Fees</h4>
          <div className="fee-item">
            <span className="fee-name">FBA Fulfillment Fee</span>
            <span className="fee-amount">$567.35</span>
          </div>
          <div className="fee-item">
            <span className="fee-name">Monthly Storage Fee</span>
            <span className="fee-amount">$89.50</span>
          </div>
          <div className="fee-item">
            <span className="fee-name">Long-term Storage Fee</span>
            <span className="fee-amount">$45.75</span>
          </div>
        </div>

        <div className="fee-category">
          <h4>Other Fees</h4>
          <div className="fee-item">
            <span className="fee-name">Shipping Services</span>
            <span className="fee-amount">$125.40</span>
          </div>
          <div className="fee-item">
            <span className="fee-name">Promotion Rebates</span>
            <span className="fee-amount">$89.65</span>
          </div>
          <div className="fee-item">
            <span className="fee-name">Refund Administration Fee</span>
            <span className="fee-amount">$9.11</span>
          </div>
        </div>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h3>Fee Details</h3>
          <div className="table-actions">
            <button className="btn btn-outline">Export</button>
            <button className="btn btn-primary">Reconcile Selected</button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Fee ID</th>
                <th>Order ID</th>
                <th>SKU</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="checkbox" /></td>
                <td>FEE-2025-00123</td>
                <td>123-4567890-1234567</td>
                <td>PROD-12345-BLUE-L</td>
                <td>Referral Fee</td>
                <td>-$8.25</td>
                <td><span className="status-badge status-success">Reconciled</span></td>
                <td>2025-09-19</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">View</button>
                  <button className="action-btn action-edit">Adjust</button>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" /></td>
                <td>FEE-2025-00124</td>
                <td>123-9876543-2109876</td>
                <td>PROD-67890-RED-M</td>
                <td>FBA Fulfillment</td>
                <td>-$4.99</td>
                <td><span className="status-badge status-pending">Pending</span></td>
                <td>2025-09-19</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">View</button>
                  <button className="action-btn action-edit">Adjust</button>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" /></td>
                <td>FEE-2025-00125</td>
                <td>123-1111111-4444444</td>
                <td>PROD-55555-BLACK-XL</td>
                <td>Storage Fee</td>
                <td>-$2.50</td>
                <td><span className="status-badge status-error">Error</span></td>
                <td>2025-09-18</td>
                <td className="action-buttons">
                  <button className="action-btn action-view">View</button>
                  <button className="action-btn action-edit">Adjust</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fees;
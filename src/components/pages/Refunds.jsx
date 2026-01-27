import React, { useEffect, useState } from 'react';
import { getRefunds } from '../../api/refunds';

import '../../styles/dashboard.css';

// Cards 
import { isCurrentMonth } from "../../utils/dateUtils";

// Charts
import RefundsByReason from "../charts/RefundsByReason";
import RefundsTimeline from "../charts/RefundsTimeline";

const Refunds = () => {
  const fechaDesde = "10-01-2024";
  const fechaHasta = "10-31-2024";

  const [refunds, setRefunds] = useState([]);
  const [refundsAll, setRefundsAll] = useState([]);
  const [loading, setLoading] = useState(true);

  const refundsByReason = Object.values(
    refunds.reduce((acc, r) => {
      const reason = r.TYPE || "Other";
      acc[reason] = acc[reason] || { label: reason, value: 0 };
      acc[reason].value += 1;
      return acc;
    }, {})
  );

  const refundsByDate = Object.values(
    refunds.reduce((acc, r) => {
      const date = r.DATE;
      if (!date) return acc;

      acc[date] = acc[date] || { date, count: 0 };
      acc[date].count += 1;

      return acc;
    }, {})
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalRefundsThisMonth = refundsAll.length;
  const processedThisMonth = refundsAll.filter(r => r.STATUS === "C").length;
  const successRate = totalRefundsThisMonth > 0 ? Math.round((processedThisMonth / totalRefundsThisMonth) * 100) : 0;
  const pendingThisMonth = refundsAll.filter(r => r.STATUS !== "C").length;

  useEffect(() => {
    const fetchRefunds = async () => {
      try {

        const allRefunds = await getRefunds({
          fecha_desde: fechaDesde,
          fecha_hasta: fechaHasta,
        });
        setRefundsAll(allRefunds)

        const data = await getRefunds({
          fecha_desde: fechaDesde,
          fecha_hasta: fechaHasta,
          limit: 10,
        });
        setRefunds(data);
      } catch (error) {
        console.error('Error fetching refunds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  return (
    <div className="main-content page active" id="refunds-page">
      <div className="content-header">
        <h1>Refunds Management</h1>
        <p>Process and monitor Amazon refund transactions</p>
      </div>

      <div className="kpi-cards">
        <div className="kpi-card">
          <div>Total Refunds</div>
          <div className="kpi-value"> {loading ? "—" : totalRefundsThisMonth} </div>
          <div className="kpi-label">This month</div>
        </div>
        <div className="kpi-card">
          <div>Processed</div>
          <div className="kpi-value"> {loading ? "—" : processedThisMonth}</div>
          <div className="kpi-label"> {loading ? "Calculating..." : `${successRate}% success rate`}</div>
        </div>
        <div className="kpi-card">
          <div>Pending</div>
          <div className="kpi-value">{loading ? "—" : pendingThisMonth}</div>
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
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    <td><div className="skeleton checkbox" /></td>
                    <td><div className="skeleton small" /></td>
                    <td><div className="skeleton medium" /></td>
                    <td><div className="skeleton large" /></td>
                    <td><div className="skeleton small" /></td>
                    <td><div className="skeleton small" /></td>
                    <td><div className="skeleton small" /></td>
                    <td><div className="skeleton medium" /></td>
                    <td><div className="skeleton button" /></td>
                  </tr>
                ))
              ) : refunds.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    No refunds found
                  </td>
                </tr>
              ) : (
                refunds.map((r, idx) => (
                  <tr key={idx}>
                    <td><input type="checkbox" /></td>

                    <td>{r.ID_UNIQUE}</td>
                    <td>{r.ORDER_ID}</td>

                    <td>
                      <div>{r.SKU}</div>
                      <div className="sku-details">
                        <div className="sku-info">
                          <span className="sku-label">Product:</span>
                          <span className="sku-value">{r.DESCRIPTION?.toLowerCase()}</span>
                        </div>
                      </div>
                    </td>

                    <td className={r.TOTAL < 0 ? "text-negative" : ""}>
                      ${r.TOTAL}
                    </td>

                    <td>{r.TYPE}</td>

                    <td>
                      <span className={`status-badge ${r.STATUS === "C" ? "status-success" : "status-pending"}`}>
                        {r.STATUS === "C" ? "Completed" : r.STATUS}
                      </span>
                    </td>

                    <td>{r.DATE}</td>

                    <td className="action-buttons">
                      <button className="action-btn action-view">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>


          </table>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-title">Refunds by Reason</div>
          {loading ? (<div className="chart-placeholder">Loading chart...</div>) : (
            <RefundsByReason data={refundsByReason} />
          )}
        </div>
        <div className="chart-container">
          <div className="chart-title">Refund Processing Timeline</div>

          {loading ? (<div className="chart-placeholder">Loading chart...</div>) : (
            <RefundsTimeline data={refundsByDate} />
          )}
        </div>

      </div>
    </div>
  );
};

export default Refunds;
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"

import { getRefundsSales, getRefundsPayments } from '../../api/refunds';

import '../../styles/dashboard.css';

// Charts
import RefundsByReason from "../charts/RefundsByReason";
import RefundsTimeline from "../charts/RefundsTimeline";

// Info tablas
import RefundsSalesRows from '../refunds/RefundsSalesRows';
import RefundsPaymentsRows from '../refunds/RefundsPaymentsRows';
import RefundsTableHeaders from '../refunds/RefundsTableHeaders';
import TableSkeletonOrEmpty from '../refunds/TableSkeletonOrEmpty';
import KPICard from '../common/KPICard';

const Refunds = () => {
  const fechaDesde = "10-01-2024";
  const fechaHasta = "10-31-2024";

  const { type } = useParams();  // sales o payments

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
        if (type == "sales") {
          const allRefunds = await getRefundsSales({
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
          });
          setRefundsAll(allRefunds)

          const data = await getRefundsSales({
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
            limit: 10,
          });
          setRefunds(data);
          return
        } else if (type == "payments") {
          const allRefunds = await getRefundsPayments({
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
          });
          setRefundsAll(allRefunds)

          const data = await getRefundsPayments({
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
            limit: 10,
          });
          setRefunds(data);
          return
        }
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
        <KPICard title="Total Refunds" value={loading ? "—" : totalRefundsThisMonth} change="This month" />
        <KPICard title="Processed" value={loading ? "—" : processedThisMonth} change={loading ? "Calculating..." : `${successRate}% success rate`} />
        <KPICard title="Pending" value={loading ? "—" : pendingThisMonth} change="Awaiting processing" />
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
            <RefundsTableHeaders />
            <tbody>
              <TableSkeletonOrEmpty
                loading={loading}
                dataLength={refunds.length}
                colSpan={9} 
                emptyMessage="No refunds found"
              />
              {!loading && refunds.length > 0 && (
                type === "sales" ?
                  <RefundsSalesRows refunds={refunds} /> :
                  <RefundsPaymentsRows payments={refunds} />
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
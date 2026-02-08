import React, { useMemo, useRef, useImperativeHandle } from "react";

// Estilos
import "../../styles/charts.css";

// Charts
import RefundsTimeline from "../charts/RefundsTimeline";
import TopSkusRefundBar from "../charts/TopSkusRefundBar";
import RefundBreakdownBar from "../charts/RefundBreakdownBar";

// Utils
import {
  groupRefundsByDate,
  topSkusByRefundAmount,
  refundBreakdownTotals,
} from "../../utils/refundMath";

// helper: soporta react-chartjs-2 v4/v5
const grabChartImage = (chartRef) => {
  const cur = chartRef?.current;
  if (!cur) return null;

  // v5 style
  if (typeof cur.toBase64Image === "function") return cur.toBase64Image();

  // algunos builds guardan instancia en cur.chart
  if (cur.chart && typeof cur.chart.toBase64Image === "function") return cur.chart.toBase64Image();

  return null;
};

const RefundsSalesCharts = React.forwardRef(({ loading = true, refunds = [] }, ref) => {
  // ✅ refs para export PDF
  const timelineRef = useRef(null);
  const topSkusRef = useRef(null);
  const breakdownRef = useRef(null);

  // charts data
  const refundsByDate = useMemo(() => groupRefundsByDate(refunds), [refunds]);
  const topSkus = useMemo(() => topSkusByRefundAmount(refunds, 5), [refunds]);
  const breakdown = useMemo(() => refundBreakdownTotals(refunds), [refunds]);

  // ✅ API para PDF
  useImperativeHandle(
    ref,
    () => ({
      getChartImages: async () => {
        if (loading) return [];

        const imgs = [];

        const a = grabChartImage(timelineRef);
        if (a) imgs.push(a);

        const b = grabChartImage(topSkusRef);
        if (b) imgs.push(b);

        const c = grabChartImage(breakdownRef);
        if (c) imgs.push(c);

        return imgs;
      },
    }),
    [loading]
  );

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Refund total per day</div>
            <div className="chart-subtitle">Line chart</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-line" />
        ) : (
          <div className="chart-inner" style={{ height: 260 }}>
            <RefundsTimeline ref={timelineRef} data={refundsByDate} />
          </div>
        )}
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Top SKUs by refund amount</div>
            <div className="chart-subtitle">Bar chart</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-bars" />
        ) : (
          <div className="chart-inner" style={{ height: 260 }}>
            <TopSkusRefundBar ref={topSkusRef} data={topSkus} />
          </div>
        )}
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Refund breakdown</div>
            <div className="chart-subtitle">Principal vs tax vs fees</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-breakdown" />
        ) : (
          <div className="chart-inner" style={{ height: 260 }}>
            <RefundBreakdownBar ref={breakdownRef} breakdown={breakdown} />
          </div>
        )}
      </div>
    </div>
  );
});

export default RefundsSalesCharts;
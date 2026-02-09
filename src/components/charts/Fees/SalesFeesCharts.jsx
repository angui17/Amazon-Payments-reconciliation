import React, { useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import "../../../styles/charts.css";

import SalesFeesByTypeDoughnut from "./SalesFeesByTypeDoughnut";
import SalesFeesTopDescriptionsBar from "./SalesFeesTopDescriptionsBar";
import SalesFeesNetByDayLine from "./SalesFeesNetByDayLine";
import SalesFeesBySettlementBar from "./SalesFeesBySettlementBar";

import {
  feesByTypeDoughnut,
  topDescriptionsBar,
  feesNetByDayLine,
  feesBySettlementBar,
} from "../../../utils/feesCharts";

const SalesFeesCharts = forwardRef(({ loading = true, fees = [] }, ref) => {
  const byType = useMemo(() => feesByTypeDoughnut(fees), [fees]);
  const topDesc = useMemo(() => topDescriptionsBar(fees, 8), [fees]);
  const netByDay = useMemo(() => feesNetByDayLine(fees), [fees]);
  const bySettlement = useMemo(() => feesBySettlementBar(fees, 12), [fees]);

  const netRef = useRef(null);
  const doughnutRef = useRef(null);
  const topDescRef = useRef(null);
  const settlementRef = useRef(null);

  const grab = (r) => {
    const cur = r.current;
    if (!cur) return null;
    if (typeof cur.toBase64Image === "function") return cur.toBase64Image();
    if (cur.chart && typeof cur.chart.toBase64Image === "function") return cur.chart.toBase64Image();
    return null;
  };

  useImperativeHandle(ref, () => ({
    getChartImages: () => {
      const imgs = [];
      [netRef, doughnutRef, topDescRef, settlementRef].forEach((r) => {
        const img = grab(r);
        if (img) imgs.push(img);
      });
      return imgs;
    },
  }));

  return (
    <div
      className="charts-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 16,
        marginTop: 16,
      }}
    >
      <div className="chart-card" style={{ gridColumn: "span 6", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 14, boxShadow: "0 6px 18px rgba(0,0,0,.06)" }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Fees net by day</div>
            <div className="chart-subtitle"> Net fees grouped by day</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-line" />
        ) : (
          <div className="chart-inner" style={{ height: 280 }}>
            <SalesFeesNetByDayLine ref={netRef} labels={netByDay.labels} values={netByDay.values} />
          </div>
        )}
      </div>

      <div className="chart-card" style={{ gridColumn: "span 6", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 14, boxShadow: "0 6px 18px rgba(0,0,0,.06)" }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Fees by type</div>
            <div className="chart-subtitle">Fees distribution by type</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-doughnut" />
        ) : (
          <div className="chart-inner" style={{ height: 280 }}>
            <SalesFeesByTypeDoughnut ref={doughnutRef} labels={byType.labels} values={byType.values} />
          </div>
        )}
      </div>

      <div className="chart-card" style={{ gridColumn: "span 6", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 14, boxShadow: "0 6px 18px rgba(0,0,0,.06)" }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Top descriptions</div>
            <div className="chart-subtitle">Descriptions with the highest impact on fees</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-bars" />
        ) : (
          <div className="chart-inner" style={{ height: 280 }}>
            <SalesFeesTopDescriptionsBar ref={topDescRef} labels={topDesc.labels} values={topDesc.values} />
          </div>
        )}
      </div>

      <div className="chart-card" style={{ gridColumn: "span 6", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 14, boxShadow: "0 6px 18px rgba(0,0,0,.06)" }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Fees by settlement</div>
            <div className="chart-subtitle">Net fees grouped by settlement</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-bars" />
        ) : (
          <div className="chart-inner" style={{ height: 300 }}>
            <SalesFeesBySettlementBar ref={settlementRef} labels={bySettlement.labels} values={bySettlement.values} />
          </div>
        )}
      </div>
    </div>
  );
});

export default SalesFeesCharts;

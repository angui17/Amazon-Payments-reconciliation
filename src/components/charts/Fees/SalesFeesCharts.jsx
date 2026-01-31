import React, { useMemo } from "react";
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

const SalesFeesCharts = ({ loading = true, fees = [] }) => {
  const byType = useMemo(() => feesByTypeDoughnut(fees), [fees]);
  const topDesc = useMemo(() => topDescriptionsBar(fees, 8), [fees]);
  const netByDay = useMemo(() => feesNetByDayLine(fees), [fees]);
  const bySettlement = useMemo(() => feesBySettlementBar(fees, 12), [fees]);

  return (
    <div className="charts-grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: 16,
      marginTop: 16
    }}>
      {/* 1) Net by day (Line) - full */}
      <div className="chart-card" style={{
        gridColumn: "span 6",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 14,
        boxShadow: "0 6px 18px rgba(0,0,0,.06)"
      }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Fees net by day</div>
            <div className="chart-subtitle">Daily net total (Σ TOTAL)</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-line" />
        ) : (
          <div className="chart-inner" style={{ height: 280 }}>
            <SalesFeesNetByDayLine labels={netByDay.labels} values={netByDay.values} />
          </div>
        )}
      </div>

      {/* 2) Doughnut by TYPE */}
      <div className="chart-card" style={{
        gridColumn: "span 6",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 14,
        boxShadow: "0 6px 18px rgba(0,0,0,.06)"
      }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Fees by type</div>
            <div className="chart-subtitle">Share by TYPE (Σ |TOTAL|)</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-doughnut" />
        ) : (
          <div className="chart-inner" style={{ height: 280 }}>
            <SalesFeesByTypeDoughnut labels={byType.labels} values={byType.values} />
          </div>
        )}
      </div>

      {/* 3) Top Descriptions */}
      <div className="chart-card" style={{
        gridColumn: "span 6",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 14,
        boxShadow: "0 6px 18px rgba(0,0,0,.06)"
      }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Top descriptions</div>
            <div className="chart-subtitle">Biggest drivers (Σ |TOTAL|)</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-bars" />
        ) : (
          <div className="chart-inner" style={{ height: 280 }}>
            <SalesFeesTopDescriptionsBar labels={topDesc.labels} values={topDesc.values} />
          </div>
        )}
      </div>

      {/* 4) Fees by settlement */}
      <div className="chart-card" style={{
        gridColumn: "span 6",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 14,
        boxShadow: "0 6px 18px rgba(0,0,0,.06)"
      }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Fees by settlement</div>
            <div className="chart-subtitle">Net total per settlement (Σ TOTAL)</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-bars" />
        ) : (
          <div className="chart-inner" style={{ height: 300 }}>
            <SalesFeesBySettlementBar labels={bySettlement.labels} values={bySettlement.values} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesFeesCharts;

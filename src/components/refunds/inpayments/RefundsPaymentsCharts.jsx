import React, { useMemo, useRef, forwardRef, useImperativeHandle } from "react";

// charts
import PaymentsTimeline from "../../charts/PaymentsTimeline";
import TopOrdersRefundBar from "../../charts/TopOrdersRefundBar";
import PaymentsRefundBreakdown from "../../charts/PaymentsRefundBreakdown";

const RefundsPaymentsCharts = forwardRef(({ loading = true, refunds = [] }, ref) => {
  const timelineRef = useRef(null);
  const topOrdersRef = useRef(null);
  const breakdownRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getChartImages: () => {
      const images = [];

      const grab = (r) => r?.current?.toBase64Image?.() || null;

      const a = grab(timelineRef);
      if (a) images.push(a);

      const b = grab(topOrdersRef);
      if (b) images.push(b);

      const c = grab(breakdownRef);
      if (c) images.push(c);

      return images;
    },
  }));

  // 1) Line: net refund per day
  const lineData = useMemo(() => {
    const map = new Map();

    for (const p of refunds || []) {
      const day = String(p?.POSTED_DATE_DATE ?? p?.POSTED_DATE ?? "").slice(0, 10);
      if (!day) continue;

      const amt = Number(p?.amount ?? p?.AMOUNT ?? 0) || 0;
      map.set(day, (map.get(day) || 0) + amt);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, value }));
  }, [refunds]);

  // 2) Bars: top orders by abs impact
  const topBarsData = useMemo(() => {
    const map = new Map();

    for (const p of refunds || []) {
      const key = String(p?.ORDER_ID ?? p?.order_id ?? "").trim();
      if (!key) continue;

      const amt = Math.abs(Number(p?.amount ?? p?.AMOUNT ?? 0) || 0);
      map.set(key, (map.get(key) || 0) + amt);
    }

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([orderId, total]) => ({ label: orderId, total }));
  }, [refunds]);

  // 3) Doughnut: breakdown by amount description
  const breakdownData = useMemo(() => {
    const map = new Map();

    for (const p of refunds || []) {
      const key = String(p?.AMOUNT_DESCRIPTION ?? p?.description ?? "Other").trim() || "Other";
      const amt = Math.abs(Number(p?.amount ?? p?.AMOUNT ?? 0) || 0);
      map.set(key, (map.get(key) || 0) + amt);
    }

    return Array.from(map.entries()).map(([label, total]) => ({ label, total }));
  }, [refunds]);

  return (
    <div className="charts-grid">
      {/* Line */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Net refund per day</div>
            <div className="chart-subtitle">How refunds move day by day</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-line" />
        ) : (
          <div className="chart-inner">
            <PaymentsTimeline ref={timelineRef} data={lineData} />
          </div>
        )}
      </div>

      {/* Bars */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Top orders by refund impact</div>
            <div className="chart-subtitle">Orders driving the biggest refunds</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-bars" />
        ) : (
          <div className="chart-inner">
            <TopOrdersRefundBar ref={topOrdersRef} data={topBarsData} />
          </div>
        )}
      </div>

      {/* Doughnut */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Refund breakdown</div>
            <div className="chart-subtitle">Where the refunds come from</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-breakdown" />
        ) : (
          <div className="chart-inner">
            <PaymentsRefundBreakdown ref={breakdownRef} data={breakdownData} />
          </div>
        )}
      </div>
    </div>
  );
});

RefundsPaymentsCharts.displayName = "RefundsPaymentsCharts";
export default RefundsPaymentsCharts;
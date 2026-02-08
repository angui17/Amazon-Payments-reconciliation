import React, { forwardRef, useImperativeHandle, useRef } from "react";
import ChartCard from "../charts/Errors/ChartCard";
import ErrorsByRuleBar from "../charts/Errors/ErrorsByRuleBar";
import ErrorsByDayLine from "../charts/Errors/ErrorsByDayLine";
import ErrorsBreakdownBars from "../charts/Errors/ErrorsBreakdownBars";

const ErrorsCharts = forwardRef(({ rows, charts, loading }, ref) => {
  const byRule = charts?.exceptionsByRule || [];
  const byDay = charts?.exceptionsByDay || [];

  const ruleRef = useRef(null);
  const dayRef = useRef(null);
  const breakdownRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getChartImages: () => {
      const images = [];

      const grab = (r) => {
        const cur = r?.current;
        if (!cur) return null;
        if (typeof cur.toBase64Image === "function") return cur.toBase64Image();
        if (cur.chart && typeof cur.chart.toBase64Image === "function") return cur.chart.toBase64Image();

        return null;
      };

      [ruleRef, dayRef, breakdownRef].forEach((r) => {
        const img = grab(r);
        if (img) images.push(img);
      });

      return images;
    },
  }));

  const isLoading = loading || !charts;

  return (
    <div className="charts-grid">
      <ChartCard
        title="Exceptions by Rule"
        subtitle="Number of exceptions by type"
        loading={isLoading}
        skeletonType="bars"
      >
        <ErrorsByRuleBar ref={ruleRef} data={byRule} />
      </ChartCard>

      <ChartCard
        title="Exceptions Trend"
        subtitle="Total exceptions per day"
        loading={isLoading}
        skeletonType="line"
      >
        <ErrorsByDayLine ref={dayRef} data={byDay} />
      </ChartCard>

      <ChartCard
        title="Exceptions Breakdown"
        subtitle="Daily breakdown: Diff / No SAP / Amazon Internal"
        loading={isLoading}
        skeletonType="bars"
      >
        <ErrorsBreakdownBars ref={breakdownRef} data={byDay} />
      </ChartCard>
    </div>
  );
});

export default ErrorsCharts;

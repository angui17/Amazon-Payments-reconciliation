import React, { forwardRef, useImperativeHandle, useRef } from "react";

import MonthlyEvolutionLine from "../charts/Reports/ReportsMonthlyCharts";
import MonthlyTopCausesStackedBar from "../charts/Reports/MonthlyTopCausesStackedBar";
import TopCausesOverallHorizontalBar from "../charts/Reports/TopCausesOverallHorizontalBar";
import TopCausesOverallDonut from "../charts/Reports/TopCausesOverallDonut";
import TopCausesOverallLinesBar from "../charts/Reports/TopCausesOverallLinesBar";

const MonthlyReconciliationCharts = forwardRef(({ charts, loading }, ref) => {
  const evolutionRef = useRef(null);
  const stackedRef = useRef(null);
  const overallBarRef = useRef(null);
  const donutRef = useRef(null);
  const linesBarRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getChartImages: () => {
      const images = [];

      const grab = (r) => {
        const cur = r.current;
        if (!cur) return null;
        
        if (typeof cur.toBase64Image === "function") return cur.toBase64Image();
        if (cur.chart && typeof cur.chart.toBase64Image === "function") return cur.chart.toBase64Image();
        return null;
      };

      [evolutionRef, stackedRef, overallBarRef, donutRef, linesBarRef].forEach((r) => {
        const img = grab(r);
        if (img) images.push(img);
      });

      return images;
    },
  }));

  return (
    <div className="charts-grid">
      <MonthlyEvolutionLine
        ref={evolutionRef}
        topCausesMonthly={charts?.topCausesMonthly || []}
        loading={loading}
      />

      <MonthlyTopCausesStackedBar
        ref={stackedRef}
        topCausesMonthly={charts?.topCausesMonthly || []}
        loading={loading}
      />

      <TopCausesOverallHorizontalBar
        ref={overallBarRef}
        topCausesOverall={charts?.topCausesOverall || []}
        loading={loading}
      />

      <TopCausesOverallDonut
        ref={donutRef}
        topCausesOverall={charts?.topCausesOverall || []}
        loading={loading}
      />

      <TopCausesOverallLinesBar
        ref={linesBarRef}
        topCausesOverall={charts?.topCausesOverall || []}
        loading={loading}
      />
    </div>
  );
});

export default MonthlyReconciliationCharts;

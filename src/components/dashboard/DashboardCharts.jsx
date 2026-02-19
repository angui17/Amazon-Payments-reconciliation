import React, { forwardRef, useImperativeHandle, useRef } from "react";
import ChartCard from "./ChartCard";
import { Line, Bar, Doughnut } from "react-chartjs-2";

import {
  buildDepositsLine,
  buildReconBar,
  buildStatusDonut,
  lineOptions,
  barOptions,
  donutOptions,
  buildStatusCountsFromRows,
  buildDepositsByDayCountsFromRows,
} from "../../utils/dashboardCharts";

import "../../styles/charts.css";

const DashboardCharts = forwardRef(({ charts, rows = [] }, ref) => {
  // refs a cada chart
  const depositsRef = useRef(null);
  const reconRef = useRef(null);
  const statusRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getChartImages: () => {
      const images = [];

      const grab = (r) => {
        const cur = r.current;
        if (!cur) return null;

        // react-chartjs-2 v4/v5 safe
        const chart =
          typeof cur.toBase64Image === "function"
            ? cur
            : cur.chart && typeof cur.chart.toBase64Image === "function"
              ? cur.chart
              : null;

        if (!chart) return null;

        // 🔹 guardamos estado original
        const prevDpr = chart.options.devicePixelRatio ?? 1;
        const prevW = chart.width;
        const prevH = chart.height;

        // 🚀 export en alta resolución
        chart.options.devicePixelRatio = 3;     // calidad HD
        chart.resize(1200, 420);               // tamaño “PDF friendly”
        chart.update("none");

        const img = chart.toBase64Image("image/png", 1.0);

        // 🔙 restauramos estado original
        chart.options.devicePixelRatio = prevDpr;
        chart.resize(prevW, prevH);
        chart.update("none");

        return img;
      };

      [depositsRef, reconRef, statusRef].forEach((r) => {
        const img = grab(r);
        if (img) images.push(img);
      });

      return images;
    },
  }));


  if (!charts) return null;

  const deposits = charts.depositsByDay || [];
  const statusFromRows = buildStatusCountsFromRows(rows);
  const reconFromRows = buildDepositsByDayCountsFromRows(rows);

  return (
    <div className="charts-grid">

      <ChartCard title="Reconciled vs Not Reconciled (by Day)">
        <div className="chart-canvas" style={{ height: "260px" }}>
          <Bar ref={reconRef} data={buildReconBar(reconFromRows)} options={barOptions} />
        </div>
      </ChartCard>

      <ChartCard title="Status Breakdown">
        <div className="chart-canvas" style={{ height: "260px" }}>
          <Doughnut ref={statusRef} data={buildStatusDonut(statusFromRows)} options={donutOptions} />
        </div>
      </ChartCard>

      <ChartCard title="Deposits by Day (Amazon vs SAP vs Difference)">
        <div className="chart-canvas" style={{ height: "260px" }}>
          <Line ref={depositsRef} data={buildDepositsLine(deposits)} options={lineOptions} />
        </div>
      </ChartCard>
    </div>
  );
});

export default DashboardCharts;

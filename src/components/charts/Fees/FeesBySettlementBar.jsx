import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const FeesBySettlementBar = forwardRef(({ labels = [], values = [] }, ref) => {
  const chartRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toBase64Image: () => {
      const cur = chartRef.current;
      if (!cur) return null;

      if (typeof cur.toBase64Image === "function") return cur.toBase64Image();
      if (cur.chart && typeof cur.chart.toBase64Image === "function") return cur.chart.toBase64Image();
      return null;
    },
  }));

  const bgColors = useMemo(
    () => values.map((v) => (v >= 0 ? ORANGE.solid : SLATE.solid)),
    [values]
  );

  const borderColors = useMemo(
    () => values.map((v) => (v >= 0 ? ORANGE.border : SLATE.border)),
    [values]
  );

  const hoverBg = useMemo(
    () => values.map((v) => (v >= 0 ? ORANGE.soft : SLATE.soft)),
    [values]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Net fees",
          data: values,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
          hoverBackgroundColor: hoverBg,
          borderRadius: 10,
          maxBarThickness: 42,
        },
      ],
    }),
    [labels, values, borderColors, bgColors, hoverBg]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `$${Number(ctx.parsed.y || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: false },
      },
      devicePixelRatio: 2,
    }),
    []
  );

  return <Bar ref={chartRef} data={data} options={options} />;
});

FeesBySettlementBar.displayName = "FeesBySettlementBar";
export default FeesBySettlementBar;

import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const FeesNetLine = forwardRef(({ labels = [], values = [] }, ref) => {
  const chartRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toBase64Image: () => {
      const cur = chartRef.current;
      if (!cur) return null;

      if (typeof cur.toBase64Image === "function") return cur.toBase64Image();
      if (cur.chart && typeof cur.chart.toBase64Image === "function")
        return cur.chart.toBase64Image();
      return null;
    },
  }));

  const borderColors = useMemo(
    () => values.map((v) => (v >= 0 ? ORANGE.border : SLATE.border)),
    [values]
  );

  const bgColors = useMemo(
    () => values.map((v) => (v >= 0 ? ORANGE.lighter : SLATE.soft)),
    [values]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Net fees",
          data: values,

          // Línea
          borderColor: borderColors,
          borderWidth: 2,
          segment: {
            borderColor: (ctx) =>
              ctx.p0.parsed.y >= 0 ? ORANGE.border : SLATE.border,
          },

          // Área
          fill: true,
          backgroundColor: bgColors,

          // Curva y puntos
          tension: 0.35,
          pointRadius: 2,
          pointHoverRadius: 4,
          pointBackgroundColor: borderColors,
          pointBorderWidth: 0,
        },
      ],
    }),
    [labels, values, borderColors, bgColors]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `$${Number(ctx.parsed.y || 0).toLocaleString()}`,
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

  return <Line ref={chartRef} data={data} options={options} />;
});

FeesNetLine.displayName = "FeesNetLine";
export default FeesNetLine;

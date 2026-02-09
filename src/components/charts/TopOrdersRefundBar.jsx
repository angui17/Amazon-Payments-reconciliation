import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";

const TopOrdersRefundBar = forwardRef(({ data = [] }, ref) => {
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

  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: data.map((d) => d.total),
          borderRadius: 6,
          barThickness: 26,
          backgroundColor: "rgba(255,107,0,0.65)",
        },
      ],
    }),
    [data]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `$${Number(ctx.raw || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { drawBorder: false },
          ticks: { callback: (v) => `$${Number(v || 0) / 1000}k` },
        },
      },
      devicePixelRatio: 2,
    }),
    []
  );

  return <Bar ref={chartRef} data={chartData} options={options} />;
});

TopOrdersRefundBar.displayName = "TopOrdersRefundBar";

export default TopOrdersRefundBar;

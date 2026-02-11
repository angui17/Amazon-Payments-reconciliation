import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";

const RefundBreakdownBar = React.forwardRef(function RefundBreakdownBar(
  { breakdown = {} },
  ref
) {
  const { principal = 0, tax = 0, fees = 0 } = breakdown || {};

  const data = useMemo(
    () => ({
      labels: ["Refund Breakdown"],
      datasets: [
        {
          label: "Principal",
          data: [principal],
          backgroundColor: "rgba(255,107,0,0.70)",
          borderRadius: 8,
          barThickness: 40,
        },
        {
          label: "Tax",
          data: [tax],
          backgroundColor: "rgba(255,107,0,0.35)",
          borderRadius: 8,
          barThickness: 40,
        },
        {
          label: "Fees",
          data: [fees],
          backgroundColor: "rgba(255,107,0,0.20)",
          borderRadius: 8,
          barThickness: 40,
        },
      ],
    }),
    [principal, tax, fees]
  );

  const options = useMemo(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const raw = Number(ctx.raw || 0);
              return `$${raw.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: {
          stacked: true,
          grid: { drawBorder: false },
          ticks: {
            callback: (v) => `$${Number(v) / 1000}k`,
          },
        },
      },
    }),
    []
  );

  return <Bar ref={ref} data={data} options={options} />;
});

export default RefundBreakdownBar;
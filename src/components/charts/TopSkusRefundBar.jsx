import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";

const TopSkusRefundBar = React.forwardRef(({ data = [] }, ref) => {
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.sku),
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
          callbacks: { label: (ctx) => `$${ctx.raw.toLocaleString()}` },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { drawBorder: false },
          ticks: { callback: (v) => `$${v / 1000}k` },
        },
      },
    }),
    []
  );

  return <Bar ref={ref} data={chartData} options={options} />;
});

export default TopSkusRefundBar;
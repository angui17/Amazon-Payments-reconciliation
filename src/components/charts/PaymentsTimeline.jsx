import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";

const PaymentsTimeline = forwardRef(({ data = [] }, ref) => {
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
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: "Net refund",
          data: data.map((d) => d.value),
          tension: 0.35,
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
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
        tooltip: { intersect: false, mode: "index" },
      },
      interaction: { intersect: false, mode: "index" },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
        y: { grid: { drawBorder: false }, ticks: { maxTicksLimit: 5 } },
      },
      devicePixelRatio: 2,
    }),
    []
  );

  return <Line ref={chartRef} data={chartData} options={options} />;
});

PaymentsTimeline.displayName = "PaymentsTimeline";

export default PaymentsTimeline;

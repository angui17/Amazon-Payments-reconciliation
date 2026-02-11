import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../utils/feesCharts";

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

          borderColor: ORANGE.border,
          backgroundColor: ORANGE.soft,

          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: ORANGE.solid,
          pointBorderColor: ORANGE.border,
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
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 8, color: SLATE.border },
        },
        y: {
          grid: { drawBorder: false, color: SLATE.soft },
          ticks: { maxTicksLimit: 5, color: SLATE.border },
        },
      },
      devicePixelRatio: 2,
    }),
    []
  );

  return <Line ref={chartRef} data={chartData} options={options} />;
});

PaymentsTimeline.displayName = "PaymentsTimeline";

export default PaymentsTimeline;

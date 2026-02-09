import React, { forwardRef, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { formatMoney } from "../../../utils/refundMath";

const PaymentsNetByDayLine = forwardRef(({ rows = [] }, ref) => {
  const data = useMemo(() => {
    return {
      labels: rows.map((r) => r.day),
      datasets: [
        {
          label: "Net amount",
          data: rows.map((r) => r.net),
          tension: 0.35,
          fill: true,
          pointRadius: 2,
        },
      ],
    };
  }, [rows]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx) => formatMoney(ctx.parsed.y),
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: false,
          ticks: {
            callback: (v) => formatMoney(v),
          },
        },
      },
    };
  }, []);

  return <Line ref={ref} data={data} options={options} />;
});

export default PaymentsNetByDayLine;

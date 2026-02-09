import React, { forwardRef, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { formatMoney } from "../../../utils/refundMath";

const PaymentsParetoByDesc = forwardRef(({ rows = [] }, ref) => {
  const data = useMemo(() => {
    const labels = rows.map((r) => r.desc);
    return {
      labels,
      datasets: [
        {
          type: "bar",
          label: "Abs total",
          data: rows.map((r) => r.absTotal),
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          type: "line",
          label: "Cumulative %",
          data: rows.map((r) => r.cumPct),
          yAxisID: "y1",
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    };
  }, [rows]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.dataset.type === "line") return `${ctx.parsed.y.toFixed(1)}%`;
              return formatMoney(ctx.parsed.y);
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { maxRotation: 60, minRotation: 20 },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => formatMoney(v) },
          title: { display: true, text: "Abs total" },
        },
        y1: {
          beginAtZero: true,
          max: 100,
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: { callback: (v) => `${v}%` },
          title: { display: true, text: "Cumulative %" },
        },
      },
    };
  }, []);

  return <Bar ref={ref} data={data} options={options} />;
});

export default PaymentsParetoByDesc;

import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { formatMoney } from "../../../utils/refundMath";

// color determinístico por índice (sin “carnaval”)
const colorForIndex = (i, alpha = 0.65) => {
  const hue = (i * 47) % 360;
  return `hsla(${hue}, 70%, 55%, ${alpha})`;
};

const PaymentsAmountStackedByDay = ({ data = [], keys = [] }) => {
  const chartData = useMemo(() => {
    return {
      labels: data.map((r) => r.day),
      datasets: keys.map((k, i) => ({
        label: k,
        data: data.map((r) => r[k] ?? 0),
        backgroundColor: colorForIndex(i, 0.55),
        borderColor: colorForIndex(i, 0.9),
        borderWidth: 1,
        borderRadius: 4,
      })),
    };
  }, [data, keys]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${formatMoney(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: {
          stacked: true,
          ticks: { callback: (v) => formatMoney(v) },
        },
      },
    };
  }, []);

  return <Bar data={chartData} options={options} />;
};

export default PaymentsAmountStackedByDay;

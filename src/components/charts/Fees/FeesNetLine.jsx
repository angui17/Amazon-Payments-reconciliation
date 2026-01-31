import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const FeesNetLine = ({ labels = [], values = [] }) => {
  const borderColors = useMemo(
    () => values.map(v => (v >= 0 ? ORANGE.border : SLATE.border)),
    [values]
  );

  const bgColors = useMemo(
    () => values.map(v => (v >= 0 ? ORANGE.lighter : SLATE.soft)),
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
          segment: { borderColor: ctx => ctx.p0.parsed.y >= 0 ? ORANGE.border : SLATE.border },

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
            label: (ctx) => `$${Number(ctx.parsed.y || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: false },
      },
    }),
    []
  );

  return <Line data={data} options={options} />;
};

export default FeesNetLine;

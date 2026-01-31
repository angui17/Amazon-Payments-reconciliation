import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const FeesBySettlementBar = ({ labels = [], values = [] }) => {

  const bgColors = useMemo(
    () => values.map(v => (v >= 0 ? ORANGE.solid : SLATE.solid)),
    [values]
  );

  const borderColors = useMemo(
    () => values.map(v => (v >= 0 ? ORANGE.border : SLATE.border)),
    [values]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Net fees",
          data: values,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
          hoverBackgroundColor: values.map(v => (v >= 0 ? ORANGE.soft : SLATE.soft)),
          borderRadius: 10,
          maxBarThickness: 42,
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
        tooltip: { callbacks: { label: (ctx) => `$${Number(ctx.parsed.y || 0).toLocaleString()}` } },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: false },
      },
    }),
    []
  );

  return <Bar data={data} options={options} />;
};

export default FeesBySettlementBar;

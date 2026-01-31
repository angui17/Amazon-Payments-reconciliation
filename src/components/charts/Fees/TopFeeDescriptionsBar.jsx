import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const TopFeeDescriptionsBar = ({ labels = [], values = [] }) => {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Abs fees",
          data: values,

          // color principal
          backgroundColor: ORANGE.solid,
          borderColor: ORANGE.border,
          borderWidth: 1,
          hoverBackgroundColor: ORANGE.soft,

          // detalles visuales
          borderRadius: 8,
          maxBarThickness: 28,
        },
      ],
    }),
    [labels, values]
  );

  const options = useMemo(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `$${Number(ctx.parsed.x || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: {
            callback: (v) => `$${Number(v).toLocaleString()}`,
          },
        },
        y: {
          grid: { display: false },
          ticks: {
            autoSkip: false,
          },
        },
      },
    }),
    []
  );

  return <Bar data={data} options={options} />;
};


export default TopFeeDescriptionsBar;

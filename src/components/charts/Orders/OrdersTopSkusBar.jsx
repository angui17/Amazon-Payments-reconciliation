import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE } from "../../../utils/ordersCharts";

const OrdersTopSkusBar = ({ labels = [], values = [] }) => {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Product Sales",
          data: values,
          backgroundColor: ORANGE.soft,
          borderColor: ORANGE.border,
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    }),
    [labels, values]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          grid: { color: ORANGE.lighter },
        },
      },
    }),
    []
  );

  return <Bar data={data} options={options} />;
};

export default OrdersTopSkusBar;

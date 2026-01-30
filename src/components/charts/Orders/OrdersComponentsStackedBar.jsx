import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";

const OrdersComponentsStackedBar = ({ labels = [], sales = [], fees = [], tax = [] }) => {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Sales",
          data: sales,
          backgroundColor: "rgba(255, 107, 0, 0.7)",
        },
        {
          label: "Fees",
          data: fees,
          backgroundColor: "rgba(255, 140, 66, 0.6)",
        },
        {
          label: "Tax",
          data: tax,
          backgroundColor: "rgba(255, 190, 120, 0.6)",
        },
      ],
    }),
    [labels, sales, fees, tax]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, beginAtZero: true },
      },
    }),
    []
  );

  return <Bar data={data} options={options} height={260} />;
};

export default OrdersComponentsStackedBar;

import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";

const SalesFeesByTypeDoughnut = ({ labels = [], values = [] }) => {
  const data = useMemo(() => ({
    labels,
    datasets: [{ data: values }]
  }), [labels, values]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed.toLocaleString()}`
        }
      }
    }
  }), []);

  return <Doughnut data={data} options={options} />;
};

export default SalesFeesByTypeDoughnut;

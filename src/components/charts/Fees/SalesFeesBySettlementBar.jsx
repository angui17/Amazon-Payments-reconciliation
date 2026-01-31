import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE } from "../../../utils/feesCharts";

const SalesFeesBySettlementBar = ({ labels = [], values = [] }) => {
  const data = useMemo(() => ({
    labels,
    datasets: [{
      label: "Net total",
      data: values,
      backgroundColor: ORANGE.soft,
      borderColor: ORANGE.border,
      borderWidth: 1,
      borderRadius: 6
    }]
  }), [labels, values]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, minRotation: 0 }
      },
      y: { grid: { color: ORANGE.lighter } }
    }
  }), []);

  return <Bar data={data} options={options} />;
};

export default SalesFeesBySettlementBar;

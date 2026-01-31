import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE } from "../../../utils/feesCharts";

const SalesFeesTopDescriptionsBar = ({ labels = [], values = [] }) => {
  const data = useMemo(() => ({
    labels,
    datasets: [{
      label: "Abs total",
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
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: ORANGE.lighter } }
    }
  }), []);

  return <Bar data={data} options={options} />;
};

export default SalesFeesTopDescriptionsBar;

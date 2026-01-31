import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ORANGE } from "../../../utils/feesCharts";

const SalesFeesNetByDayLine = ({ labels = [], values = [] }) => {
  const data = useMemo(() => ({
    labels,
    datasets: [{
      label: "Net fees",
      data: values,
      borderColor: ORANGE.border,
      backgroundColor: ORANGE.soft,
      fill: true,
      tension: 0.35,
      pointRadius: 2
    }]
  }), [labels, values]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: ORANGE.lighter } }
    }
  }), []);

  return <Line data={data} options={options} />;
};

export default SalesFeesNetByDayLine;

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const ErrorsByDayLine = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const labels = (data || []).map((x) => x.date);
    const values = (data || []).map((x) => Number(x.exceptions ?? 0));

    return {
      labels,
      datasets: [
        {
          label: "Exceptions",
          data: values,
          borderColor: ORANGE.border,
          backgroundColor: ORANGE.lighter,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#6b7280" } },
        y: { beginAtZero: true, ticks: { color: "#6b7280" } },
      },
    }),
    []
  );

  return <Line data={chartData} options={options} />;
};

export default ErrorsByDayLine;

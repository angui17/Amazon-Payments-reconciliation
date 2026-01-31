import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const ErrorsBreakdownBars = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const labels = (data || []).map((x) => x.date);

    return {
      labels,
      datasets: [
        {
          label: "_toggle_diff",
          data: (data || []).map((x) => Number(x.diff ?? 0)),
          backgroundColor: ORANGE.soft,
          borderColor: ORANGE.border,
          borderWidth: 1,
        },
        {
          label: "No SAP",
          data: (data || []).map((x) => Number(x.missingSap ?? 0)),
          backgroundColor: SLATE.soft,
          borderColor: SLATE.border,
          borderWidth: 1,
        },
        {
          label: "Amazon internal",
          data: (data || []).map((x) => Number(x.amazonInternal ?? 0)),
          backgroundColor: "rgba(185, 28, 28, 0.18)",
          borderColor: "rgba(185, 28, 28, 0.8)",
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: "#6b7280" } },
        y: { stacked: true, beginAtZero: true, ticks: { color: "#6b7280" } },
      },
    }),
    []
  );

  return <Bar data={chartData} options={options} />;
};

export default ErrorsBreakdownBars;

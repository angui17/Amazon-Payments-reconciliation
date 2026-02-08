import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE } from "../../../utils/feesCharts";

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const AccountingBreakdownByDescriptionBar = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const sorted = [...(data || [])]
      .map((x) => ({
        label: x?.description ?? "—",
        amount: toNum(x?.amount),
      }))
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 12);

    return {
      labels: sorted.map((x) => x.label),
      datasets: [
        {
          label: "Amount",
          data: sorted.map((x) => x.amount),
          backgroundColor: ORANGE.soft,
          borderColor: ORANGE.border,
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          ticks: { color: "#6b7280", maxRotation: 0, autoSkip: false },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#6b7280", autoSkip: false, },
          grid: { color: "rgba(71,85,105,0.12)" },
        },
      },
    }),
    []
  );

  return <Bar data={chartData} options={options} />;
};

export default AccountingBreakdownByDescriptionBar;

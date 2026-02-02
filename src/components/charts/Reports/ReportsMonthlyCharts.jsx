import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import ChartCard from "../../common/ChartCard";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const groupSumByMonth = (rows = []) => {
  const map = new Map();
  for (const r of rows) {
    const month = r.month;
    const value = Number(r.amazonTotal ?? r.amountAbs ?? r.amount ?? 0);

    if (!map.has(month)) map.set(month, 0);
    map.set(month, map.get(month) + value);
  }
  return Array.from(map.entries())
    .map(([month, amazonTotal]) => ({
      month,
      amazonTotal,
      sapTotal: 0,
      differenceTotal: amazonTotal - 0,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

const MonthlyEvolutionLine = ({ topCausesMonthly = [], loading }) => {
  const monthly = useMemo(() => groupSumByMonth(topCausesMonthly), [topCausesMonthly]);

  const labels = monthly.map((m) => m.month);

  const data = {
    labels,
    datasets: [
      {
        label: "Amazon total",
        data: monthly.map((m) => m.amazonTotal),
        borderColor: ORANGE.border,
        backgroundColor: ORANGE.soft,
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
      {
        label: "SAP total",
        data: monthly.map((m) => m.sapTotal),
        borderColor: SLATE.border,
        backgroundColor: SLATE.soft,
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
      {
        label: "Difference",
        data: monthly.map((m) => m.differenceTotal),
        borderColor: "#111827",
        backgroundColor: "rgba(17,24,39,.08)",
        tension: 0.35,
        borderDash: [6, 4],
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "bottom" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <ChartCard
      title="Monthly Evolution"
      subtitle="Amazon vs SAP vs Difference"
      loading={loading}
    >
      <Line data={data} options={options} />
    </ChartCard>
  );
};

export default MonthlyEvolutionLine;

import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../../common/ChartCard";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const label = (s) => String(s || "Other").trim() || "Other";

const TopCausesOverallLinesBar = ({ topCausesOverall = [], loading }) => {
  const rows = useMemo(() => {
    const arr = Array.isArray(topCausesOverall) ? topCausesOverall : [];
    return [...arr].sort((a, b) => num(b.lines) - num(a.lines));
  }, [topCausesOverall]);

  const labels = rows.map((r) => label(r.amountDescription));
  const values = rows.map((r) => num(r.lines));

  const data = {
    labels,
    datasets: [
      {
        label: "Lines",
        data: values,
        backgroundColor: SLATE.soft,
        borderColor: SLATE.border,
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 18,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Lines: ${Number(ctx.raw ?? 0).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "rgba(17,24,39,.06)" },
      },
      y: {
        grid: { display: false },
        ticks: { color: SLATE.border },
      },
    },
  };

  return (
    <ChartCard
      title="Top causes by volumen"
      subtitle="Order by lines"
      loading={loading}
    >
      <Bar data={data} options={options} />
    </ChartCard>
  );
};

export default TopCausesOverallLinesBar;

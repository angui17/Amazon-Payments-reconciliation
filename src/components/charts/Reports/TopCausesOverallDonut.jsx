import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import ChartCard from "../../common/ChartCard"; 
import { ORANGE, SLATE } from "../../../utils/feesCharts"; 

const TOP_N = 6;

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const label = (s) => String(s || "Other").trim() || "Other";

const TopCausesOverallDonut = ({ topCausesOverall = [], loading }) => {
  const { labels, values } = useMemo(() => {
    const arr = Array.isArray(topCausesOverall) ? topCausesOverall : [];
    const sorted = [...arr].sort(
      (a, b) => num(b.amountAbs ?? b.amount) - num(a.amountAbs ?? a.amount)
    );

    const top = sorted.slice(0, TOP_N);
    const rest = sorted.slice(TOP_N);

    const donutLabels = top.map((r) => label(r.amountDescription));
    const donutValues = top.map((r) => num(r.amountAbs ?? r.amount));

    const otherSum = rest.reduce((acc, r) => acc + num(r.amountAbs ?? r.amount), 0);

    if (otherSum > 0) {
      donutLabels.push("Other");
      donutValues.push(otherSum);
    }

    return { labels: donutLabels, values: donutValues };
  }, [topCausesOverall]);

  const colors = useMemo(
    () => [
      ORANGE.solid,
      SLATE.solid,
      ORANGE.soft,
      SLATE.soft,
      ORANGE.lighter,
      "rgba(17,24,39,.18)",
      "rgba(17,24,39,.10)", 
    ],
    []
  );

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => colors[i] || ORANGE.soft),
        borderColor: "rgba(255,255,255,.95)",
        borderWidth: 2,
        hoverOffset: 6,
        cutout: "62%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = Number(ctx.raw ?? 0);
            return ` ${ctx.label}: ${v.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <ChartCard
      title="Overall distribution"
      subtitle={`Top ${TOP_N} + Other (by amountAbs)`}
      loading={loading}
    >
      <Doughnut data={data} options={options} />
    </ChartCard>
  );
};

export default TopCausesOverallDonut;

import React, { useMemo, forwardRef } from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../../common/ChartCard";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const normalizeLabel = (s) => String(s || "Other").trim() || "Other";

const TopCausesOverallHorizontalBar = forwardRef(
  ({ topCausesOverall = [], loading }, chartRef) => {
    const rows = useMemo(() => {
      const arr = Array.isArray(topCausesOverall) ? topCausesOverall : [];
      // orden descendente por monto absoluto
      return [...arr].sort(
        (a, b) => num(b.amountAbs ?? b.amount) - num(a.amountAbs ?? a.amount)
      );
    }, [topCausesOverall]);

    const labels = rows.map((r) => normalizeLabel(r.amountDescription));
    const values = rows.map((r) => num(r.amountAbs ?? r.amount));

    const data = useMemo(
      () => ({
        labels,
        datasets: [
          {
            label: "Amount",
            data: values,
            backgroundColor: ORANGE.soft,
            borderColor: ORANGE.border,
            borderWidth: 1,
            borderRadius: 8,
            barThickness: 18,
          },
        ],
      }),
      [labels, values]
    );

    const options = useMemo(
      () => ({
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y", // horizontal
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const v = ctx.raw ?? 0;
                return ` ${Number(v).toLocaleString()}`;
              },
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
      }),
      []
    );

    return (
      <ChartCard
        title="Top causes overall"
        subtitle="Order by amountAbs"
        loading={loading}
      >
        {/* ✅ ref para export a PDF */}
        <Bar ref={chartRef} data={data} options={options} />
      </ChartCard>
    );
  }
);

export default TopCausesOverallHorizontalBar;

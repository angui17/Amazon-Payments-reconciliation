import React, { useMemo, forwardRef } from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../../common/ChartCard";
import { SLATE } from "../../../utils/feesCharts";

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const label = (s) => String(s || "Other").trim() || "Other";

const TopCausesOverallLinesBar = forwardRef(
  ({ topCausesOverall = [], loading }, chartRef) => {
    const rows = useMemo(() => {
      const arr = Array.isArray(topCausesOverall) ? topCausesOverall : [];
      return [...arr].sort((a, b) => num(b.lines) - num(a.lines));
    }, [topCausesOverall]);

    const labels = useMemo(() => rows.map((r) => label(r.amountDescription)), [rows]);
    const values = useMemo(() => rows.map((r) => num(r.lines)), [rows]);

    const data = useMemo(
      () => ({
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
      }),
      [labels, values]
    );

    const options = useMemo(
      () => ({
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
      }),
      []
    );

    return (
      <ChartCard
        title="Top causes by volumen"
        subtitle="Order by lines"
        loading={loading}
      >
        {/* ✅ ref para export a PDF */}
        <Bar ref={chartRef} data={data} options={options} />
      </ChartCard>
    );
  }
);

export default TopCausesOverallLinesBar;
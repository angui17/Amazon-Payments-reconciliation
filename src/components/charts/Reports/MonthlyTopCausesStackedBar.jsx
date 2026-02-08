import React, { useMemo, forwardRef } from "react";
import { Bar } from "react-chartjs-2";
import ChartCard from "../../common/ChartCard";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const TOP_N = 5;

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const normalizeLabel = (s) => String(s || "Other").trim() || "Other";

const MonthlyTopCausesStackedBar = forwardRef(
  ({ topCausesMonthly = [], loading }, chartRef) => {
    const { labels, seriesKeys, matrixByKey } = useMemo(() => {
      const rows = Array.isArray(topCausesMonthly) ? topCausesMonthly : [];

      // 1) total por causa (para elegir Top 5 global)
      const totalsByCause = new Map();
      for (const r of rows) {
        const cause = normalizeLabel(r.amountDescription);
        totalsByCause.set(
          cause,
          (totalsByCause.get(cause) || 0) + num(r.amountAbs ?? r.amount)
        );
      }

      const sortedCauses = Array.from(totalsByCause.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([cause]) => cause);

      const topCauses = sortedCauses.slice(0, TOP_N);
      const OTHER = "Other";
      const keys = [...topCauses, OTHER];

      // 2) months únicos
      const months = Array.from(new Set(rows.map((r) => String(r.month)))).sort(
        (a, b) => a.localeCompare(b)
      );

      // 3) init matrix key -> [0..months-1]
      const idxByMonth = new Map(months.map((m, i) => [m, i]));
      const matrix = Object.fromEntries(
        keys.map((k) => [k, Array(months.length).fill(0)])
      );

      // 4) poblar valores
      for (const r of rows) {
        const month = String(r.month);
        const i = idxByMonth.get(month);
        if (i === undefined) continue;

        const causeRaw = normalizeLabel(r.amountDescription);
        const cause = topCauses.includes(causeRaw) ? causeRaw : OTHER;

        matrix[cause][i] += num(r.amountAbs ?? r.amount);
      }

      return { labels: months, seriesKeys: keys, matrixByKey: matrix };
    }, [topCausesMonthly]);

    const palette = useMemo(() => {
      return [
        ORANGE.solid,
        SLATE.solid,
        ORANGE.soft,
        SLATE.soft,
        ORANGE.lighter,
        "rgba(17,24,39,.18)",
      ];
    }, []);

    const data = useMemo(() => {
      return {
        labels,
        datasets: seriesKeys.map((k, idx) => ({
          label: k,
          data: matrixByKey[k],
          backgroundColor: palette[idx] || ORANGE.soft,
          borderWidth: 0,
          barThickness: 18,
        })),
      };
    }, [labels, seriesKeys, matrixByKey, palette]);

    const options = useMemo(() => {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: { mode: "index", intersect: false },
        },
        interaction: { mode: "index", intersect: false },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, beginAtZero: true },
        },
      };
    }, []);

    return (
      <ChartCard
        title="Monthly Top causes"
        subtitle={`Stacked: Top ${TOP_N} + Other`}
        loading={loading}
      >
        {/* ✅ ref para export a PDF */}
        <Bar ref={chartRef} data={data} options={options} />
      </ChartCard>
    );
  }
);

export default MonthlyTopCausesStackedBar;

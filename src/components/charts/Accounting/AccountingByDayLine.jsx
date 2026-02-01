import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

const AccountingByDayLine = ({ data }) => {
  const sorted = useMemo(() => {
    return [...(data || [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  const labels = useMemo(() => sorted.map((d) => d.date), [sorted]);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Amazon Total",
          data: sorted.map((d) => safeNum(d.amazonTotal)),
          borderColor: ORANGE.border,
          backgroundColor: ORANGE.lighter,
          fill: true,
        },
        {
          label: "SAP Payments",
          data: sorted.map((d) => safeNum(d.sapPaymentsTotal)),
          borderColor: SLATE.border,
          backgroundColor: SLATE.soft,
          fill: true,
        },
        {
          label: "SAP Journal Debit",
          data: sorted.map((d) => safeNum(d.sapJournalDebit)),
          borderColor: SLATE.solid,
          backgroundColor: SLATE.soft,
          fill: false,
          borderDash: [6, 4],
        },
        {
          label: "Diff Payments",
          data: sorted.map((d) => safeNum(d.diffPaymentsTotal)),
          borderColor: ORANGE.solid,
          backgroundColor: ORANGE.soft,
          fill: false,
          borderWidth: 2,
        },
      ],
    }),
    [labels, sorted]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${safeNum(ctx.parsed.y).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: { ticks: { maxRotation: 0, autoSkip: true } },
        y: {
          ticks: {
            callback: (v) => Number(v).toLocaleString(),
          },
        },
      },
      elements: {
        line: { tension: 0.25, borderWidth: 2 },
        point: { radius: 2, hoverRadius: 4 },
      },
    }),
    []
  );

  if (!sorted.length) {
    return <div className="chart-placeholder">No data</div>;
  }

  return <Line data={chartData} options={options} />;
};

export default AccountingByDayLine;

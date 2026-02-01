import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../../utils/feesCharts"; 

const abs = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.abs(n) : 0;
};

const SettlementBarsByType = ({ data }) => {
  const cleaned = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const labels = useMemo(() => cleaned.map((d) => d.type ?? "Unknown"), [cleaned]);
  const values = useMemo(() => cleaned.map((d) => abs(d.amount)), [cleaned]);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "ABS(amount)",
          data: values,
          backgroundColor: ORANGE.soft,
          borderColor: ORANGE.border,
          borderWidth: 1,
          borderRadius: 8,
          maxBarThickness: 60,
        },
      ],
    }),
    [labels, values]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (ctx) => ctx?.[0]?.label || "",
            label: (ctx) => {
              const i = ctx.dataIndex;
              const raw = cleaned[i];
              const amount = Number(raw?.amount);
              const lines = raw?.lines ?? "—";
              const amt = Number.isFinite(amount) ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";
              return [`amount: ${amt}`, `lines: ${lines}`];
            },
          },
        },
      },
      scales: {
        x: { ticks: { autoSkip: false }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { callback: (v) => Number(v).toLocaleString() } },
      },
    }),
    [cleaned]
  );

  if (!cleaned.length) return <div className="chart-placeholder">No data</div>;

  return <Bar data={chartData} options={options} />;
};

export default SettlementBarsByType;

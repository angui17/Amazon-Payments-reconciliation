import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../../utils/feesCharts"; 

const abs = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.abs(n) : 0;
};

const SettlementParetoByDescription = ({ data, top = 12 }) => {
  const sorted = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return [...arr].sort((a, b) => abs(b.amount) - abs(a.amount)).slice(0, top);
  }, [data, top]);

  const labels = useMemo(
    () => sorted.map((d) => d.description ?? "Unknown"),
    [sorted]
  );

  const values = useMemo(() => sorted.map((d) => abs(d.amount)), [sorted]);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "ABS(amount)",
          data: values,
          backgroundColor: SLATE.soft,
          borderColor: SLATE.border,
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
              const raw = sorted[i];
              const amount = Number(raw?.amount);
              const lines = raw?.lines ?? "—";
              const type = raw?.type ?? "—";
              const amt = Number.isFinite(amount) ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";
              return [`type: ${type}`, `amount: ${amt}`, `lines: ${lines}`];
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { autoSkip: false, maxRotation: 60, minRotation: 20 },
          grid: { display: false },
        },
        y: { beginAtZero: true, ticks: { callback: (v) => Number(v).toLocaleString() } },
      },
    }),
    [sorted]
  );

  if (!sorted.length) return <div className="chart-placeholder">No data</div>;

  return <Bar data={chartData} options={options} />;
};

export default SettlementParetoByDescription;

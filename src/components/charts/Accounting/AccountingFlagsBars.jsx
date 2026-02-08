import React, { useMemo, forwardRef } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const pretty = (k) => {
  const s = String(k || "");
  if (s === "missingPayments") return "Missing Payments";
  if (s === "missingJournal") return "Missing Journal";
  if (s === "unbalancedJournal") return "Unbalanced Journal";
  return s;
};

const AccountingFlagsBars = forwardRef(({ data = [] }, ref) => {
  const chartData = useMemo(() => {
    const labels = (data || []).map((x) => pretty(x.label));
    const values = (data || []).map((x) => Number(x.count ?? 0));

    return {
      labels,
      datasets: [
        {
          label: "Count",
          data: values,
          backgroundColor: [ORANGE.soft, SLATE.soft, "rgba(185, 28, 28, 0.18)"],
          borderColor: [ORANGE.border, SLATE.border, "rgba(185, 28, 28, 0.85)"],
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#6b7280", font: { size: 12 } } },
        y: { beginAtZero: true, ticks: { color: "#6b7280" }, grid: { color: "rgba(71,85,105,0.12)" } },
      },
    }),
    []
  );

  return <Bar ref={ref} data={chartData} options={options} />;
});

export default AccountingFlagsBars;
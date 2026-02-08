import React, { useMemo, forwardRef } from "react";
import { Line } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const AccountingByDayLine = forwardRef(({ data = [] }, ref) => {
  const chartData = useMemo(() => {
    const labels = (data || []).map((x) => x.date);

    return {
      labels,
      datasets: [
        {
          label: "Amazon total",
          data: (data || []).map((x) => toNum(x.amazonTotal)),
          borderColor: ORANGE.border,
          backgroundColor: ORANGE.lighter,
          fill: false,
          tension: 0.35,
          pointRadius: 2,
        },
        {
          label: "SAP payments",
          data: (data || []).map((x) => toNum(x.sapPaymentsTotal)),
          borderColor: SLATE.border,
          backgroundColor: SLATE.soft,
          fill: false,
          tension: 0.35,
          pointRadius: 2,
        },
        {
          label: "SAP journal debit",
          data: (data || []).map((x) => toNum(x.sapJournalDebit)),
          borderColor: "rgba(16, 185, 129, 1)",
          backgroundColor: "rgba(16, 185, 129, 0.12)",
          fill: false,
          tension: 0.35,
          pointRadius: 2,
        },
        {
          label: "Payments diff",
          data: (data || []).map((x) => toNum(x.diffPaymentsTotal)),
          borderColor: "rgba(185, 28, 28, 0.85)",
          backgroundColor: "rgba(185, 28, 28, 0.10)",
          fill: false,
          tension: 0.35,
          pointRadius: 2,
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" }, tooltip: { enabled: true } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#6b7280", maxRotation: 0 } },
        y: { ticks: { color: "#6b7280" }, grid: { color: "rgba(71,85,105,0.12)" } },
      },
    }),
    []
  );

  return <Line ref={ref} data={chartData} options={options} />;
});

export default AccountingByDayLine;
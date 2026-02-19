import React, { forwardRef, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { formatMoney } from "../../../utils/numberUtils"; 
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const label = (s) => String(s || "Other").trim() || "Other";

const TopCausesParetoBar = forwardRef(function TopCausesParetoBar(
  { data = [], maxItems = 12 },
  ref
) {
  const rows = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];

    // “Top” suele ser por impacto: ordeno por ABS(amount) desc
    const sorted = [...arr].sort((a, b) => Math.abs(num(b.amount)) - Math.abs(num(a.amount)));

    return sorted.slice(0, Math.max(1, Number(maxItems) || 12));
  }, [data, maxItems]);

  const chartData = useMemo(() => {
    const labels = rows.map((r) => label(r.amountDescription));
    const values = rows.map((r) => num(r.amount));

    return {
      labels,
      datasets: [
        {
          label: "Total",
          data: values,
          backgroundColor: ORANGE.soft,
          borderColor: ORANGE.border,
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 14,
        },
      ],
    };
  }, [rows]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y", 
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${formatMoney ? formatMoney(ctx.parsed.x) : ctx.parsed.x}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#6b7280",
            callback: (v) => (formatMoney ? formatMoney(v) : v),
          },
        },
        y: {
          grid: { display: false },
          ticks: {
            color: "#6b7280",
            callback: function (val) {
              const t = this.getLabelForValue(val);
              return String(t).length > 24 ? `${String(t).slice(0, 24)}…` : t;
            },
          },
        },
      },
    }),
    []
  );

  return <Bar ref={ref} data={chartData} options={options} />;
});

export default TopCausesParetoBar;
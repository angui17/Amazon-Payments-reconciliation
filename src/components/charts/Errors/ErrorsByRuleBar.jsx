import React, { forwardRef, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE } from "../../../utils/feesCharts";
import { ruleLabel } from "../../../utils/errorsCharts";

const ErrorsByRuleBar = forwardRef(function ErrorsByRuleBar({ data = [] }, ref) {
  const chartData = useMemo(() => {
    const labels = (data || []).map((x) => ruleLabel(x.rule));
    const values = (data || []).map((x) => Number(x.count ?? 0));

    return {
      labels,
      datasets: [
        {
          label: "Exceptions",
          data: values,
          backgroundColor: ORANGE.soft,
          borderColor: ORANGE.border,
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          ticks: { color: "#6b7280", font: { size: 12 } },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#6b7280" },
          grid: { color: "rgba(71,85,105,0.12)" },
        },
      },
    }),
    []
  );

  return <Bar ref={ref} data={chartData} options={options} />;
});

export default ErrorsByRuleBar;

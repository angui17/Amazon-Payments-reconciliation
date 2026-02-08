import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { money, truncate } from "../../../utils/errorsCharts";
import { ORANGE, SLATE } from "../../../utils/feesCharts"

const COLORS = [
  ORANGE.solid,
  SLATE.solid,
  ORANGE.soft,
  SLATE.soft,
];

const BreakdownByTypeChart = ({ data = [] }) => {
  const { chartData, options, total } = useMemo(() => {
    const labels = data.map((d) => truncate(d.type, 22));
    const values = data.map((d) => Math.abs(Number(d.amount ?? 0)));
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      total: sum,
      chartData: {
        labels,
         datasets: [
          {
            data: values,
            backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
            borderColor: ORANGE.border,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 14,
              color: "#374151",
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = Number(ctx.parsed ?? 0);
                const pct = total ? (val / sum) * 100 : 0;
                return ` ${money(val)} (${pct.toFixed(1)}%)`;
              },
            },
          },
        },
      },
    };
  }, [data]);

  return <Doughnut data={chartData} options={options} />;
};

export default BreakdownByTypeChart;

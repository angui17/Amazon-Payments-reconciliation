import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { money, truncate } from "../../../utils/errorsCharts";
import { ORANGE, SLATE } from "../../../utils/feesCharts"

const BreakdownByAmountDescriptionChart = ({ data = [] }) => {
  const { chartData, options } = useMemo(() => {
    const labels = data.map((d) => truncate(d.amountDescription, 26));
    const values = data.map((d) => Number(d.amount ?? 0));

    return {
      chartData: {
        labels,
        datasets: [
          {
            label: "Amount",
            data: values,
            backgroundColor: ORANGE.soft,
            borderColor: ORANGE.border,
            hoverBackgroundColor: ORANGE.solid,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { attempt: 1, display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${money(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 },
            grid: { display: false },
          },
          y: {
            ticks: {
              callback: (v) => money(v),
            },
            grid: {
              color: SLATE.soft,
            },
          },
        },
      },
    };
  }, [data]);

  return <Bar data={chartData} options={options} />;
};

export default BreakdownByAmountDescriptionChart;

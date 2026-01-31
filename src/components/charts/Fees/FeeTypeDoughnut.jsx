import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const FeeTypeDoughnut = ({ labels = [], values = [] }) => {

  const colors = useMemo(() => {
    const palette = [
      ORANGE.solid,
      ORANGE.soft,
      ORANGE.lighter,
      SLATE.solid,
      SLATE.soft,
    ];

    return labels.map((_, i) => palette[i % palette.length]);
  }, [labels]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: "#fff",
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    }),
    [labels, values, colors]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: $${Number(ctx.raw || 0).toLocaleString()}`,
          },
        },
      },
    }),
    []
  );

  return <Doughnut data={data} options={options} />;
};

export default FeeTypeDoughnut;

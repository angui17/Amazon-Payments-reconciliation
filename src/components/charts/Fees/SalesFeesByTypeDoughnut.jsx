import React, { useMemo, forwardRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const SalesFeesByTypeDoughnut = forwardRef(
  ({ labels = [], values = [] }, ref) => {
    const colors = useMemo(() => {
      // paleta base 
      const palette = [
        ORANGE.solid,
        SLATE.solid,
        ORANGE.soft,
        SLATE.soft,
        ORANGE.lighter,
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
            borderColor: colors.map(() => "#fff"),
            borderWidth: 2,
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
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${ctx.label}: ${ctx.parsed.toLocaleString()}`,
            },
          },
        },
      }),
      []
    );

    return <Doughnut ref={ref} data={data} options={options} />;
  }
);

export default SalesFeesByTypeDoughnut;

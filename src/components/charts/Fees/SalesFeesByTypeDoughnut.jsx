import React, { useMemo, forwardRef } from "react";
import { Doughnut } from "react-chartjs-2";

const SalesFeesByTypeDoughnut = forwardRef(
  ({ labels = [], values = [] }, ref) => {
    const data = useMemo(
      () => ({
        labels,
        datasets: [
          {
            data: values,
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

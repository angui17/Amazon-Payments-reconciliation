import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { ORANGE } from "../../../utils/ordersCharts";

const OrdersFulfillmentMixDoughnut = React.forwardRef(
  ({ labels = [], values = [] }, ref) => {
    const palette = useMemo(
      () => [
        ORANGE.main,
        "rgba(255, 107, 0, 0.70)",
        ORANGE.soft,
        ORANGE.lighter,
      ],
      []
    );

    const data = useMemo(
      () => ({
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: labels.map(
              (_, i) => palette[i % palette.length]
            ),
            borderColor: ORANGE.border,
            borderWidth: 1,
            hoverOffset: 6,
          },
        ],
      }),
      [labels, values, palette]
    );

    const options = useMemo(
      () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
        },
        cutout: "65%",
      }),
      []
    );

    return <Doughnut ref={ref} data={data} options={options} />;
  }
);

export default OrdersFulfillmentMixDoughnut;

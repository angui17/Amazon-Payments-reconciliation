import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ORANGE } from "../../../utils/ordersCharts";

const OrdersNetTotalLineChart = React.forwardRef(({ labels = [], values = [] }, ref) => {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Net Total",
          data: values,
          tension: 0.35,
          fill: true,
          borderColor: ORANGE.border,
          backgroundColor: ORANGE.soft,
          pointBackgroundColor: ORANGE.main,
          pointBorderColor: "#fff",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    }),
    [labels, values]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true },
      },
    }),
    []
  );

  return <Line ref={ref} data={data} options={options} height={260} />;
});

export default OrdersNetTotalLineChart;

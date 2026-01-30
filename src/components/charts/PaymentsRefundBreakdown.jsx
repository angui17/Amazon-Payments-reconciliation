import { Doughnut } from "react-chartjs-2";

const PaymentsRefundBreakdown = ({ data = [] }) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.total),
        backgroundColor: [
          "rgba(255,107,0,0.75)",   // Principal
          "rgba(255,159,64,0.75)",  // Commission
          "rgba(255,205,86,0.75)",  // Tax
          "rgba(201,203,207,0.75)", // Other
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.label}: $${Number(ctx.raw || 0).toLocaleString()}`,
        },
      },
    },
    cutout: "65%",
  };

  return <Doughnut data={chartData} options={options} />;
};

export default PaymentsRefundBreakdown;

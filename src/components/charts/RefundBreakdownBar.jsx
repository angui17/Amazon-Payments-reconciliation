import { Bar } from "react-chartjs-2";

const RefundBreakdownBar = ({ breakdown }) => {
  const { principal = 0, tax = 0, fees = 0 } = breakdown || {};

  const data = {
    labels: ["Refund Breakdown"],
    datasets: [
      {
        label: "Principal",
        data: [principal],
        backgroundColor: "rgba(255,107,0,0.70)",
        borderRadius: 8,
        barThickness: 40,
      },
      {
        label: "Tax",
        data: [tax],
        backgroundColor: "rgba(255,107,0,0.35)",
        borderRadius: 8,
        barThickness: 40,
      },
      {
        label: "Fees",
        data: [fees],
        backgroundColor: "rgba(255,107,0,0.20)",
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: {
        stacked: true,
        grid: { drawBorder: false },
        ticks: { callback: (v) => `$${v / 1000}k` },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default RefundBreakdownBar;

import { Bar } from "react-chartjs-2";

const TopSkusRefundBar = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.sku),
    datasets: [
      {
        data: data.map(d => d.total),
        borderRadius: 6,
        barThickness: 26,
        backgroundColor: "rgba(255,107,0,0.65)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { drawBorder: false },
        ticks: {
          callback: (v) => `$${v / 1000}k`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default TopSkusRefundBar;

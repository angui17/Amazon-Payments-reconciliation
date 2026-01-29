import { Line } from "react-chartjs-2";

const RefundsTimeline = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: "Refunds",
        data: data.map(d => d.count), // por ahora count; luego lo cambiamos a amount
        tension: 0.35,
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        intersect: false,
        mode: "index",
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 8 },
      },
      y: {
        grid: { drawBorder: false },
        ticks: { maxTicksLimit: 5 },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default RefundsTimeline;

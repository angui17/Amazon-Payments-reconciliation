import { Line } from "react-chartjs-2";

const RefundsTimeline = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: "Refunds",
        data: data.map(d => d.count),
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ height: "200px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RefundsTimeline;

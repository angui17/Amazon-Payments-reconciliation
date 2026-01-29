// refundsByReason.jsx
import { Pie } from "react-chartjs-2";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 12,
        padding: 16,
      },
    },
  },
};

const RefundsByReason = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: [
          "#FF6B6B",
          "#FFD93D",
          "#6BCB77",
          "#4D96FF",
          "#845EC2",
        ],
      },
    ],
  };

  return (
    <div style={{ height: "200px" }}>
      <Pie data={chartData} options={options} />
    </div>
  );

};

export default RefundsByReason;
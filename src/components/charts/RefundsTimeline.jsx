import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { ORANGE } from "../../utils/feesCharts";

const RefundsTimeline = React.forwardRef(function RefundsTimeline({ data = [] }, ref) {
  // data: [{ date: "10/31/2024", count: 3 }, ...]
  const { labels, values } = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return {
      labels: arr.map((d) => d.date),
      values: arr.map((d) => Number(d.count || 0)),
    };
  }, [data]);

  const chartData = useMemo(
    () => ({
      labels,
      datasets:  [
        {
          label: "Refunds",
          data: values,

          // 🎨 PALETA
          borderColor: ORANGE.border,
          backgroundColor: ORANGE.soft,
          pointBackgroundColor: ORANGE.solid,
          pointBorderColor: "#fff",

          // ✨ estilo
          tension: 0.35,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
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
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true },
      },
    }),
    []
  );

  return <Line ref={ref} data={chartData} options={options} />;
});

export default RefundsTimeline;

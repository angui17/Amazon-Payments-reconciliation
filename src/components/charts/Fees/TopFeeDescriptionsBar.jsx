import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE } from "../../../utils/feesCharts";

const TopFeeDescriptionsBar = forwardRef(({ labels = [], values = [] }, ref) => {
  const chartRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toBase64Image: () => {
      const cur = chartRef.current;
      if (!cur) return null;

      if (typeof cur.toBase64Image === "function") return cur.toBase64Image();
      if (cur.chart && typeof cur.chart.toBase64Image === "function") return cur.chart.toBase64Image();
      return null;
    },
  }));

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Abs fees",
          data: values,

          // color principal
          backgroundColor: ORANGE.solid,
          borderColor: ORANGE.border,
          borderWidth: 1,
          hoverBackgroundColor: ORANGE.soft,

          // detalles visuales
          borderRadius: 8,
          maxBarThickness: 28,
        },
      ],
    }),
    [labels, values]
  );

  const options = useMemo(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `$${Number(ctx.parsed.x || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: {
            callback: (v) => `$${Number(v).toLocaleString()}`,
          },
        },
        y: {
          grid: { display: false },
          ticks: { autoSkip: false },
        },
      },
      devicePixelRatio: 2,
    }),
    []
  );

  return <Bar ref={chartRef} data={data} options={options} />;
});

TopFeeDescriptionsBar.displayName = "TopFeeDescriptionsBar";
export default TopFeeDescriptionsBar;

import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const FeeTypeDoughnut = forwardRef(({ labels = [], values = [] }, ref) => {
  const chartRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toBase64Image: () => {
      const cur = chartRef.current;
      if (!cur) return null;

      // react-chartjs-2 v4/v5 safe
      if (typeof cur.toBase64Image === "function") return cur.toBase64Image();
      if (cur.chart && typeof cur.chart.toBase64Image === "function") return cur.chart.toBase64Image();
      return null;
    },
  }));

  const colors = useMemo(() => {
    const palette = [ORANGE.solid, ORANGE.soft, ORANGE.lighter, SLATE.solid, SLATE.soft];
    return labels.map((_, i) => palette[i % palette.length]);
  }, [labels]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: "#fff",
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    }),
    [labels, values, colors]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: $${Number(ctx.raw || 0).toLocaleString()}`,
          },
        },
      },
      devicePixelRatio: 2,
    }),
    []
  );

  return <Doughnut ref={chartRef} data={data} options={options} />;
});

FeeTypeDoughnut.displayName = "FeeTypeDoughnut";
export default FeeTypeDoughnut;

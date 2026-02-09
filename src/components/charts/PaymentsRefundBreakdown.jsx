import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Doughnut } from "react-chartjs-2";

const PaymentsRefundBreakdown = forwardRef(({ data = [] }, ref) => {
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

  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: data.map((d) => d.total),
          backgroundColor: [
            "rgba(255,107,0,0.75)",   // Principal
            "rgba(255,159,64,0.75)",  // Commission
            "rgba(255,205,86,0.75)",  // Tax
            "rgba(201,203,207,0.75)", // Other
          ],
          borderWidth: 0,
        },
      ],
    }),
    [data]
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
      cutout: "65%",
      devicePixelRatio: 2,
    }),
    []
  );

  return <Doughnut ref={chartRef} data={chartData} options={options} />;
});

PaymentsRefundBreakdown.displayName = "PaymentsRefundBreakdown";

export default PaymentsRefundBreakdown;

import { ORANGE, SLATE } from "./feesCharts";

const safeNum = (v) => (v === null || v === undefined || Number.isNaN(Number(v)) ? 0 : Number(v));

export const buildDepositsLine = (depositsByDay = []) => {
  const labels = depositsByDay.map((d) => d.date);

  return {
    labels,
    datasets: [
      {
        label: "Amazon Total",
        data: depositsByDay.map((d) => safeNum(d.amazonTotal)),
        borderColor: ORANGE.border,
        backgroundColor: ORANGE.soft,
        pointRadius: 2,
        tension: 0.35,
      },
      {
        label: "SAP Total",
        data: depositsByDay.map((d) => safeNum(d.sapTotal)),
        borderColor: SLATE.border,
        backgroundColor: SLATE.soft,
        pointRadius: 2,
        tension: 0.35,
      },
      {
        label: "Difference",
        data: depositsByDay.map((d) => safeNum(d.difference)),
        borderColor: SLATE.border,
        backgroundColor: SLATE.soft,
        pointRadius: 0,
        tension: 0.35,
        borderDash: [6, 6],
        fill: false,
      },
    ],
  };
};

export const buildReconBar = (depositsByDay = []) => {
  const labels = depositsByDay.map((d) => d.date);

  return {
    labels,
    datasets: [
      {
        label: "Reconciled",
        data: depositsByDay.map((d) => safeNum(d.reconciled)),
        backgroundColor: ORANGE.solid,
        borderColor: ORANGE.border,
        borderWidth: 1,
      },
      {
        label: "Not Reconciled",
        data: depositsByDay.map((d) => safeNum(d.notReconciled)),
        backgroundColor: SLATE.solid,
        borderColor: SLATE.border,
        borderWidth: 1,
      },
    ],
  };
};

export const buildStatusDonut = (statusCounts = []) => {
  const labels = statusCounts.map((s) => s.label);
  const data = statusCounts.map((s) => safeNum(s.count));

  // si hoy viene solo "P", igual se ve bien. Cuando llegue "C", entra solo.
  const bg = labels.map((l) => (l === "P" ? ORANGE.solid : SLATE.solid));
  const border = labels.map((l) => (l === "P" ? ORANGE.border : SLATE.border));

  return {
    labels,
    datasets: [
      {
        label: "Status",
        data,
        backgroundColor: bg,
        borderColor: border,
        borderWidth: 1,
      },
    ],
  };
};

export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
};

export const lineOptions = {
  ...baseChartOptions,
  scales: {
    x: { ticks: { maxRotation: 0 } },
    y: { beginAtZero: true },
  },
};

export const barOptions = {
  ...baseChartOptions,
  scales: {
    x: { stacked: false },
    y: { beginAtZero: true },
  },
};

export const donutOptions = {
  ...baseChartOptions,
  cutout: "60%",
};

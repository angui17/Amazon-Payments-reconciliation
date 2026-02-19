import { ORANGE, SLATE } from "./feesCharts";
import { getReconciledBool, normStatus, getDiff } from "./kpicards";

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

export const buildStatusDonut = (statusCounts = []) => {
  const LABELS = {
    COMPLETED: "Completed",
    PENDING: "Pending",
    NOT_RECONCILED: "Not Reconciled",
  };

  const COLORS = {
    COMPLETED: ORANGE.solid,
    PENDING: SLATE.solid,
    NOT_RECONCILED: SLATE.soft,
  };

  const BORDER_COLORS = {
    COMPLETED: ORANGE.border,
    PENDING: SLATE.border,
    NOT_RECONCILED: SLATE.border,
  };

  const safe = Array.isArray(statusCounts) ? statusCounts : [];

  const labels = safe.map((x) => LABELS[x?.status] || x?.status || "Unknown");
  const data = safe.map((x) => Number(x?.count ?? x?.value ?? 0));

  const backgroundColor = safe.map(
    (x) => COLORS[x?.status] || SLATE.soft
  );
  const borderColor = safe.map(
    (x) => BORDER_COLORS[x?.status] || SLATE.border
  );

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  };
};

export const buildReconBar = (rowsByDay = []) => {
  const safe = Array.isArray(rowsByDay) ? rowsByDay : [];

  const labels = safe.map((x) => x?.day ?? x?.date ?? "");
  const reconciled = safe.map((x) => Number(x?.reconciled ?? x?.reconciledCount ?? 0));
  const notReconciled = safe.map((x) => Number(x?.notReconciled ?? x?.notReconciledCount ?? 0));

  return {
    labels,
    datasets: [
      {
        label: "Reconciled",
        data: reconciled,
        backgroundColor: ORANGE.solid,
        borderColor: ORANGE.border,
        borderWidth: 1,
      },
      {
        label: "Not Reconciled",
        data: notReconciled,
        backgroundColor: SLATE.solid,
        borderColor: SLATE.border,
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


const getDepositDay = (r) => r?.depositDateDate || String(r?.depositDate || "").split(" ")[0];

export const effectiveStatusForRow = (r) => {
  // 1) si viene reconciled -> manda
  const hasReconciledField =
    r?.reconciled !== undefined ||
    r?.RECONCILED !== undefined ||
    r?.isReconciled !== undefined ||
    r?.IS_RECONCILED !== undefined;

  if (hasReconciledField) return getReconciledBool(r) ? "COMPLETED" : "PENDING";

  // 2) fallback status
  const s = normStatus(r);
  if (["COMPLETED", "C", "RECONCILED"].includes(s)) return "COMPLETED";
  if (["NR", "NOT_RECONCILED", "NOT RECONCILED"].includes(s)) return "NOT_RECONCILED";
  if (["P", "PENDING"].includes(s)) return "PENDING";

  // 3) último fallback: diff
  return getDiff(r) === 0 ? "COMPLETED" : "PENDING";
};

export const buildStatusCountsFromRows = (rows = []) => {
  const map = new Map(); // status -> count
  for (const r of rows) {
    const s = effectiveStatusForRow(r);
    map.set(s, (map.get(s) || 0) + 1);
  }
  return Array.from(map.entries()).map(([status, count]) => ({ status, count }));
};

export const buildDepositsByDayCountsFromRows = (rows = []) => {
  const byDay = new Map(); // day -> { reconciled, notReconciled }
  for (const r of rows) {
    const day = getDepositDay(r);
    if (!day) continue;

    const rec = getReconciledBool(r) || effectiveStatusForRow(r) === "COMPLETED";
    const cur = byDay.get(day) || { day, reconciled: 0, notReconciled: 0 };

    if (rec) cur.reconciled += 1;
    else cur.notReconciled += 1;

    byDay.set(day, cur);
  }

  // orden por fecha asc (string YYYY-MM-DD sirve)
  return Array.from(byDay.values()).sort((a, b) => String(a.day).localeCompare(String(b.day)));
};
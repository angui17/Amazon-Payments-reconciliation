import React, { useMemo } from "react";
import KPICard from "../common/KPICard";

import { money, trendByDiff } from "../../utils/kpicards";

const int = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
};

const pctFrom = (num, den) => {
  const n = Number(num);
  const d = Number(den);
  if (!Number.isFinite(n) || !Number.isFinite(d) || d <= 0) return "—";
  return `${Math.round((n / d) * 100)}%`;
};

const clamp0 = (n) => (Number.isFinite(n) ? Math.max(0, n) : 0);

const ReportsKpiCards = ({ summary, totalSummary }) => {
  const cards = useMemo(() => {
    if (!summary) return [];

    const total = int(summary?.settlementsCount);
    const reconciled = int(summary?.reconciledCount);

    // si no confiás en la BD:
    // const notReconciled = clamp0(total - reconciled);
    const notReconciled = int(summary?.notReconciledCount);

    const pending = clamp0(total - reconciled - notReconciled);
    const reconciledPctNum = total > 0 ? (reconciled / total) * 100 : 0;

    return [
      {
        title: "Settlements",
        value: `${total}`,
        change: `${reconciled} reconciled · ${notReconciled} with differences`,
        trend: "neutral",
      },
      {
        title: "Reconciled %",
        value: pctFrom(reconciled, total),
        change: reconciledPctNum >= 100
          ? "All settlements reconciled"
          : `${notReconciled} with differences`,
        trend: reconciledPctNum >= 95 ? "up" : "neutral",
      },
      {
        title: "Amazon Total",
        value: money(summary.amazonTotal),
        trend: "neutral",
        change: "Total amount reported by Amazon",
      },
      {
        title: "SAP Total",
        value: money(summary.sapTotal),
        change: "Total amount recorded in SAP",
        trend: "neutral",
      },
      {
        title: "Difference Total",
        value: money(summary.differenceTotal),
        change:
          Number(summary.differenceTotal) === 0
            ? "No difference between SAP and Amazon"
            : Number(summary.differenceTotal) < 0
              ? "SAP amount is higher than Amazon"
              : "Amazon amount is higher than SAP",
        trend: trendByDiff(summary.differenceTotal),
      },
    ];
  }, [summary]);

  return (
    <div className="kpi-cards">
      {cards.map((c) => (
        <KPICard
          key={c.title}
          title={c.title}
          value={c.value}
          change={c.change}
          trend={c.trend}
        />
      ))}
    </div>
  );
};

export default ReportsKpiCards;
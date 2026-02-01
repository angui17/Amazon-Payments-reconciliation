import React, { useMemo } from "react";
import KPICard from "../common/KPICard";

const money = (n) => {
  const val = Number(n);
  if (Number.isNaN(val)) return "-";
  return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const int = (n) => {
  const val = Number(n);
  if (Number.isNaN(val)) return "-";
  return val.toLocaleString("en-US");
};

const pct = (n) => {
  const val = Number(n);
  if (Number.isNaN(val)) return "-";
  return `${val.toFixed(2)}%`;
};

const trendByDiff = (diff) => {
  const val = Number(diff);
  if (Number.isNaN(val) || val === 0) return "neutral";
  return val < 0 ? "down" : "up"; // negativo = mala noticia (ej: SAP > Amazon)
};

const ReportsKpiCards = ({ summary }) => {
  const cards = useMemo(() => {
    if (!summary) return [];

    return [
      {
        title: "Settlements",
        value: int(summary.settlementsCount),
        change: `${int(summary.reconciledCount)} reconciled · ${int(summary.notReconciledCount)} with differences`,
        trend: "neutral",
      },
      {
        title: "Reconciled %",
        value: pct(summary.reconciledPct),
        change: summary.pendingCount > 0 ? `${int(summary.pendingCount)} pending` : "All settlements processed",
        trend: summary.reconciledPct >= 95 ? "up" : "neutral",
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
        change: summary.differenceTotal === 0 ? "No difference between SAP and Amazon"
          : summary.differenceTotal < 0 ? "SAP amount is higher than Amazon" : "Amazon amount is higher than SAP",
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

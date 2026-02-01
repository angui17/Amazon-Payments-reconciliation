import React, { useMemo } from "react";
import KPICard from "../../common/KPICard";
import SettlementKPIsSkeleton from "./SettlementKPIsSkeleton";

const fmtMoney = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const trendFromNumber = (n) => {
  const x = Number(n);
  if (!Number.isFinite(x) || x === 0) return "neutral";
  return x > 0 ? "up" : "down";
};

const SettlementKPIs = ({ summary, loading = false }) => {
  const cards = useMemo(() => {
    if (!summary) return [];

    const {
      amazonTotalReported,
      sapPaymentsTotal,
      difference,
      reconciled,
      sapPaymentsCount,
      amazonInternalDiff,
    } = summary;

    return [
      {
        title: "Amazon Total",
        value: fmtMoney(amazonTotalReported),
        trend: "neutral",
      },
      {
        title: "SAP Total",
        value: fmtMoney(sapPaymentsTotal),
        trend: "neutral",
      },
      {
        title: "Diff",
        value: fmtMoney(difference),
        trend: trendFromNumber(difference),
        change: Number(difference) === 0 ? "Balanced" : "Needs review",
      },
      {
        title: "Reconciled",
        value: reconciled ? "Yes" : "No",
        trend: reconciled ? "up" : "down",
        change: reconciled ? "All good" : "Not reconciled",
      },
      {
        title: "SAP payments count",
        value: Number.isFinite(Number(sapPaymentsCount)) ? String(sapPaymentsCount) : "—",
        trend: "neutral",
      },
      {
        title: "Amazon internal diff",
        value: fmtMoney(amazonInternalDiff),
        trend: trendFromNumber(amazonInternalDiff),
      },
    ];
  }, [summary]);

  if (loading) return <SettlementKPIsSkeleton count={6} />;
  if (!summary) return null;

  return (
    <div className="settlement-kpis-grid" style={{ marginTop: "20px" }}>
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

export default SettlementKPIs;

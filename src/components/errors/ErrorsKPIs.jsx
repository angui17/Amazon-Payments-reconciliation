import React from "react";
import KPICard from "../common/KPICard";
import KPICardSkeleton from "../dashboard/KPICardSkeleton";

const money = (n) => {
  const num = Number(n ?? 0);
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const ErrorsKPIs = ({ summary267, summary279, loading }) => {
  // Skeleton cuando está cargando o todavía no hay summary mínimo
  if (loading || !summary267) {
    return (
      <div className="kpi-cards">
        {Array.from({ length: 6 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const exceptionsTotal = safeNum(summary267.exceptionsCount);

  const has279 = Boolean(summary279);
  const settlementsCount = has279 ? safeNum(summary279.settlementsCount) : null;
  const diffCount = has279 ? safeNum(summary279.diffCount) : null;
  const noSapCount = has279 ? safeNum(summary279.noSapCount) : null;
  const amazonInternalCount = has279 ? safeNum(summary279.amazonInternalCount) : null;
  const differenceTotal = has279 ? Number(summary279.differenceTotal ?? 0) : null;

  return (
    <div className="kpi-cards">
      <KPICard
        title="Exceptions (Total)"
        value={exceptionsTotal}
        change="Total exceptions detected in the selected range"
        trend={exceptionsTotal > 0 ? "warning" : "up"}
      />

      <KPICard
        title="Settlements analyzed"
        value={has279 ? settlementsCount : "—"}
        change={has279 ? "Count of settlements checked for exceptions" : "Summary from WS 279 not loaded"}
        trend={has279 && settlementsCount > 0 ? "neutral" : "neutral"}
      />

      <KPICard
        title="Diff Amazon vs SAP (count)"
        value={has279 ? diffCount : "—"}
        change={has279 ? "Settlements where Amazon total != SAP total" : "Summary from WS 279 not loaded"}
        trend={has279 && diffCount > 0 ? "danger" : "up"}
      />

      <KPICard
        title="No SAP Payment (count)"
        value={has279 ? noSapCount : "—"}
        change={has279 ? "SAP payments count = 0 while Amazon total != 0" : "Summary from WS 279 not loaded"}
        trend={has279 && noSapCount > 0 ? "danger" : "up"}
      />

      <KPICard
        title="Amazon internal mismatch (count)"
        value={has279 ? amazonInternalCount : "—"}
        change={has279 ? "Amazon lines don't match reported total" : "Summary from WS 279 not loaded"}
        trend={has279 && amazonInternalCount > 0 ? "danger" : "up"}
      />

      <KPICard
        title="Difference total $"
        value={has279 ? money(differenceTotal) : "—"}
        change={
          has279
            ? (Number(differenceTotal) === 0
                ? "Total difference is 0 (nice)"
                : "Net difference across flagged settlements")
            : "Summary from WS 279 not loaded"
        }
        trend={
          has279
            ? (Number(differenceTotal) < 0 ? "danger" : Number(differenceTotal) > 0 ? "warning" : "up")
            : "neutral"
        }
      />
    </div>
  );
};

export default ErrorsKPIs;

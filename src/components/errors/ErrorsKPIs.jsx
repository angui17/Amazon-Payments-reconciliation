import React, { useMemo } from "react";
import KPICard from "../common/KPICard";
import KPICardSkeleton from "../dashboard/KPICardSkeleton";

// utils
import { computeErrorsKpis, money } from "../../utils/errorsKpis";

const ErrorsKPIs = ({ rows = [], loading }) => {
  if (loading) {
    return (
      <div className="kpi-cards">
        {Array.from({ length: 6 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const hasRows = Array.isArray(rows) && rows.length > 0;

  // si no hay filas, cards en cero
  if (!hasRows) {
    return (
      <div className="kpi-cards">
        <KPICard title="Total Exceptions" value={0} change="No results for current filters" trend="up" />
        <KPICard title="Settlements analyzed" value={0} change="No results for current filters" trend="neutral" />
        <KPICard title="Amazon vs SAP mismatch (count)" value={0} change="No results for current filters" trend="up" />
        <KPICard title="Missing SAP payment (count)" value={0} change="No results for current filters" trend="up" />
        <KPICard title="Amazon internal mismatch (count)" value={0} change="No results for current filters" trend="up" />
        <KPICard title="Difference total" value={money(0)} change="No results for current filters" trend="up" />
      </div>
    );
  }

  // KPIs reales
  const {
    exceptionsTotal,
    settlementsCount,
    diffCount,
    noSapCount,
    amazonInternalCount,
    differenceTotal,
  } = computeErrorsKpis(rows);

  return (
    <div className="kpi-cards">
      <KPICard
        title="Total Exceptions"
        value={exceptionsTotal}
        change="Based on current filtered results"
        trend={exceptionsTotal > 0 ? "warning" : "up"}
      />

      <KPICard
        title="Settlements analyzed"
        value={settlementsCount}
        change="Based on current filtered results"
        trend="neutral"
      />

      <KPICard
        title="Amazon vs SAP mismatch (count)"
        value={diffCount}
        change="Settlements with a mismatch between Amazon and SAP totals"
        trend={diffCount > 0 ? "danger" : "up"}
      />

      <KPICard
        title="Missing SAP payment (count)"
        value={noSapCount}
        change="Amazon shows sales, but no SAP payment was found"
        trend={noSapCount > 0 ? "danger" : "up"}
      />

      <KPICard
        title="Amazon internal mismatch (count)"
        value={amazonInternalCount}
        change="Amazon lines don't match reported total"
        trend={amazonInternalCount > 0 ? "danger" : "up"}
      />

      <KPICard
        title="Difference total"
        value={money(differenceTotal)}
        change={differenceTotal === 0 ? "Total difference is 0" : "Net difference across flagged settlements"}
        trend={differenceTotal < 0 ? "danger" : differenceTotal > 0 ? "warning" : "up"}
      />
    </div>
  );
};

export default ErrorsKPIs;

import React, { useMemo } from "react";
import KPICard from "../common/KPICard";
import "../../styles/kpi.css";
import KPICardSkeleton from "./KPICardSkeleton";

import { money, trendByDiff, buildSettlementsReconciliationKpis } from "../../utils/kpicards";

const DashboardKPIs = ({ rows = [] }) => {
  const computed = useMemo(() => {
    if (!Array.isArray(rows)) return null;
    if (rows.length === 0) return null;

    return buildSettlementsReconciliationKpis(rows, {
      currency: "USD",
      locale: "en-US",
    });
  }, [rows]);

  // Si no hay rows en esta página, mostramos skeleton (o podrías mostrar ceros)
  if (!computed) {
    return (
      <div className="kpi-cards">
        {Array.from({ length: 9 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const {
    settlementsCount,
    pendingCount,
    reconciledCount,
    notReconciledCount,
    amazonInternalDiffCount,
    missingSettlementIdCount,
    amazonTotalFormatted,
    sapTotalFormatted,
    differenceTotalFormatted,
    raw,
  } = computed;

  const amazonTotalRaw = Number(raw?.amazonTotal ?? 0) || 0;
  const sapTotalRaw = Number(raw?.sapTotal ?? 0) || 0;
  const differenceRaw = Number(raw?.differenceTotal ?? (amazonTotalRaw - sapTotalRaw)) || 0;

  const pctReconciled =
    settlementsCount > 0 ? (reconciledCount / settlementsCount) * 100 : 0;

  const pctText =
    settlementsCount > 0
      ? `${pctReconciled.toFixed(0)}% of settlements are reconciled`
      : "No settlements in selected range";

  const diffTrend = trendByDiff(differenceRaw);

  return (
    <div className="kpi-cards">
      <KPICard
        title="Settlements"
        value={settlementsCount}
        change="Total deposit batches detected in the period"
        trend="neutral"
      />

      <KPICard
        title="Status: Pending"
        value={pendingCount}
        change="Pending settlements awaiting final reconciliation"
        trend={pendingCount > 0 ? "warning" : "up"}
      />

      <KPICard
        title="Reconciled"
        value={reconciledCount}
        change={`${pctText} • ${notReconciledCount} not reconciled`}
        trend={settlementsCount > 0 && pctReconciled === 100 ? "up" : "warning"}
      />

      <KPICard
        title="Not Reconciled"
        value={notReconciledCount}
        change="Settlements with mismatch between Amazon and SAP totals"
        trend={notReconciledCount > 0 ? "danger" : "up"}
      />

      <KPICard
        title="Amazon Total"
        value={amazonTotalFormatted ?? money(amazonTotalRaw)}
        change="Sum of Amazon reported deposits for the selected range"
        trend="neutral"
      />

      <KPICard
        title="SAP Total"
        value={sapTotalFormatted ?? money(sapTotalRaw)}
        change="Sum of SAP posted payments for the selected range"
        trend="neutral"
      />

      <KPICard
        title="Difference (Amazon - SAP)"
        value={differenceTotalFormatted ?? money(differenceRaw)}
        change={
          Math.abs(differenceRaw) === 0
            ? "Perfect match between Amazon and SAP totals"
            : `Mismatch of ${differenceTotalFormatted ?? money(differenceRaw)} to investigate`
        }
        trend={Math.abs(differenceRaw) === 0 ? "up" : diffTrend}
      />

      <KPICard
        title="Amazon Internal Diff Count"
        value={amazonInternalDiffCount}
        change={
          amazonInternalDiffCount > 0
            ? "⚠️ Amazon doesn't match internally (lines vs reported total)"
            : "No internal Amazon inconsistencies detected"
        }
        trend={amazonInternalDiffCount > 0 ? "danger" : "up"}
      />

      <KPICard
        title="Missing Settlement ID Count"
        value={missingSettlementIdCount}
        change="Rows without settlementId (should be 0 in current SP)"
        trend={missingSettlementIdCount > 0 ? "danger" : "up"}
      />
    </div>
  );
};

export default DashboardKPIs;
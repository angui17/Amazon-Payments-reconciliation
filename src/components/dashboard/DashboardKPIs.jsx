import React, { useMemo } from "react";
import KPICard from "../common/KPICard";
import "../../styles/kpi.css";
import KPICardSkeleton from "./KPICardSkeleton";

const money = (n) => {
  const num = Number(n || 0);
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const normStatus = (r) =>
  String(r?.status ?? r?.STATUS ?? r?.Status ?? "").trim().toUpperCase();

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const isTruthy = (v) => v === true || v === 1 || v === "1" || String(v).toLowerCase() === "true";

const getReconciledBool = (r) => {
  const v = r?.reconciled ?? r?.RECONCILED ?? r?.isReconciled ?? r?.IS_RECONCILED;
  return isTruthy(v);
};

const getAmazonAmount = (r) =>
  num(
    r.amazonTotalReported ??
    r.amazonTotal ??
    r.AMAZON_TOTAL ??
    r.amazon_total ??
    r.AMAZON ??
    r.amountAmazon
  );

const getSapAmount = (r) =>
  num(
    r.sapPaymentsTotal ??
    r.sapTotal ??
    r.SAP_TOTAL ??
    r.sap_total ??
    r.SAP ??
    r.amountSap
  );

const getAmazonInternalDiff = (r) => Number(r?.exceptionsCount || 0) > 0

const hasMissingSettlementId = (r) =>
  !String(r.settlementId ?? r.SETTLEMENT_ID ?? r.settlement_id ?? "").trim();

const buildSummaryFromRows = (rows = []) => {
  const settlementsCount = rows.length;

  let pendingCount = 0;
  let reconciledCount = 0;
  let notReconciledCount = 0;

  let amazonTotal = 0;
  let sapTotal = 0;

  let amazonInternalDiffCount = 0;
  let missingSettlementIdCount = 0;

  for (const r of rows) {
    const s = normStatus(r);
    if (s === "PENDING" || s === "P") pendingCount++;

    const hasReconciledField =
      r?.reconciled !== undefined ||
      r?.RECONCILED !== undefined ||
      r?.isReconciled !== undefined ||
      r?.IS_RECONCILED !== undefined

    if (hasReconciledField) {
      const reconciled = getReconciledBool(r);
      if (reconciled) reconciledCount++;
      else notReconciledCount++;
    } else {
      if (s === "RECONCILED" || s === "C" || s === "COMPLETED") reconciledCount++;
      else if (s === "NOT_RECONCILED" || s === "NR" || s === "NOT RECONCILED") notReconciledCount++;
    }

    // totals
    amazonTotal += getAmazonAmount(r);
    sapTotal += getSapAmount(r);

    if (getAmazonInternalDiff(r)) amazonInternalDiffCount++;
    if (hasMissingSettlementId(r)) missingSettlementIdCount++;
  }

  const differenceTotal = amazonTotal - sapTotal;

  return {
    settlementsCount,
    pendingCount,
    reconciledCount,
    notReconciledCount,
    amazonTotal,
    sapTotal,
    differenceTotal,
    amazonInternalDiffCount,
    missingSettlementIdCount,
  };
};

const DashboardKPIs = ({ summary, rows = [] }) => {
  const computed = useMemo(() => {
    if (!rows || rows.length === 0) return null;
    return buildSummaryFromRows(rows);
  }, [rows]);


  const finalSummary = computed || summary;

  if (!finalSummary) {
    return (
      <div className="kpi-cards">
        {Array.from({ length: 9 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const {
    settlementsCount = 0,
    pendingCount = 0,
    reconciledCount = 0,
    notReconciledCount = 0,
    amazonTotal = 0,
    sapTotal = 0,
    differenceTotal = 0,
    amazonInternalDiffCount = 0,
    missingSettlementIdCount = 0,
  } = finalSummary;

  const pctReconciled =
    settlementsCount > 0 ? (reconciledCount / settlementsCount) * 100 : 0;

  const pctText =
    settlementsCount > 0
      ? `${pctReconciled.toFixed(0)}% of settlements are reconciled`
      : "No settlements in selected range";

  const diffAbs = Math.abs(Number(differenceTotal || 0));
  const diffTrend =
    diffAbs === 0 ? "up" : Number(differenceTotal) < 0 ? "down" : "warning";

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
        value={money(amazonTotal)}
        change="Sum of Amazon reported deposits for the selected range"
        trend="neutral"
      />

      <KPICard
        title="SAP Total"
        value={money(sapTotal)}
        change="Sum of SAP posted payments for the selected range"
        trend="neutral"
      />

      <KPICard
        title="Difference (Amazon - SAP)"
        value={money(differenceTotal)}
        change={
          diffAbs === 0
            ? "Perfect match between Amazon and SAP totals"
            : `Mismatch of ${money(differenceTotal)} to investigate`
        }
        trend={diffTrend}
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

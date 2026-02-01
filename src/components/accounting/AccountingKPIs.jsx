import React, { useMemo } from "react";
import KPICard from "../common/KPICard";
import KPICardSkeleton from "../dashboard/KPICardSkeleton";
import { safeNum, formatMoney } from "../../utils/numberUtils";

const getStatus = (r) => String(r?.status ?? r?.STATUS ?? r?.Status ?? "").toUpperCase();

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const sumField = (arr, candidates) =>
  arr.reduce((acc, r) => {
    for (const k of candidates) {
      const v = r?.[k];
      if (v !== undefined && v !== null && v !== "") return acc + toNum(v);
    }
    return acc;
  }, 0);

const countTruthy = (arr, candidates) =>
  arr.reduce((acc, r) => {
    for (const k of candidates) {
      const v = r?.[k];
      if (v === true) return acc + 1;
      if (typeof v === "string" && ["1", "true", "yes", "y"].includes(v.toLowerCase())) return acc + 1;
      if (typeof v === "number" && v !== 0) return acc + 1;
    }
    return acc;
  }, 0);

const AccountingKPIs = ({ summary, rows, loading }) => {
  const hasRows = Array.isArray(rows);

  const kpi = useMemo(() => {
    if (hasRows) {
      // ⚠️ Estos keys son “best effort”.
      // Si me pasás 1 row real del WS269, los afinamos a la perfección.
      const settlements = rows.length;
      const pending = rows.filter((r) => getStatus(r) === "P").length;

      const amazonTotal = sumField(rows, ["amazonTotal", "amazon_total", "AMAZON_TOTAL"]);
      const sapPaymentsTotal = sumField(rows, ["sapPaymentsTotal", "sap_payments_total", "SAP_PAYMENTS_TOTAL"]);
      const diffPaymentsTotal = sumField(rows, ["diffPaymentsTotal", "diff_payments_total", "DIFF_PAYMENTS_TOTAL"]);

      const missingJournal = countTruthy(rows, ["missingJournal", "missing_journal", "MISSING_JOURNAL"]);
      const missingPayments = countTruthy(rows, ["missingPayments", "missing_payments", "MISSING_PAYMENTS"]);
      const unbalancedJournals = countTruthy(rows, ["unbalancedJournal", "unbalanced_journal", "UNBALANCED_JOURNAL"]);

      return {
        settlements,
        pending,
        amazonTotal,
        sapPaymentsTotal,
        diffPaymentsTotal,
        missingJournal,
        missingPayments,
        unbalancedJournals,
      };
    }

    // fallback a summary del WS
    return {
      settlements: safeNum(summary?.settlementsCount),
      pending: safeNum(summary?.pendingCount),
      amazonTotal: safeNum(summary?.amazonTotal),
      sapPaymentsTotal: safeNum(summary?.sapPaymentsTotal),
      diffPaymentsTotal: safeNum(summary?.diffPaymentsTotal),
      missingJournal: safeNum(summary?.missingJournalCount),
      missingPayments: safeNum(summary?.missingPaymentsCount),
      unbalancedJournals: safeNum(summary?.unbalancedJournalCount),
    };
  }, [hasRows, rows, summary]);

  // Skeleton mientras carga o no hay data en ninguno de los dos
  if (loading || (!hasRows && !summary)) {
    return (
      <div className="kpi-cards">
        {Array.from({ length: 8 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const {
    settlements,
    pending,
    amazonTotal,
    sapPaymentsTotal,
    diffPaymentsTotal,
    missingJournal,
    missingPayments,
    unbalancedJournals,
  } = kpi;

  return (
    <div className="kpi-cards">
      <KPICard
        title="Settlements"
        value={settlements}
        change="Total settlements in selected range"
        trend="neutral"
      />

      <KPICard
        title="Pending"
        value={pending}
        change="Settlements still pending"
        trend={pending > 0 ? "warning" : "up"}
      />

      <KPICard
        title="Amazon total"
        value={formatMoney(amazonTotal)}
        change="Amazon total amount"
        trend={amazonTotal < 0 ? "danger" : "neutral"}
      />

      <KPICard
        title="SAP payments total"
        value={formatMoney(sapPaymentsTotal)}
        change="Total paid in SAP"
        trend={sapPaymentsTotal < 0 ? "danger" : "neutral"}
      />

      <KPICard
        title="Payments diff total"
        value={formatMoney(diffPaymentsTotal)}
        change="Amazon vs SAP payments net difference"
        trend={
          diffPaymentsTotal !== 0
            ? diffPaymentsTotal < 0
              ? "danger"
              : "warning"
            : "up"
        }
      />

      <KPICard
        title="Missing Journal"
        value={missingJournal}
        change="Settlements missing journal entry"
        trend={missingJournal > 0 ? "danger" : "up"}
      />

      <KPICard
        title="Missing Payments"
        value={missingPayments}
        change="Settlements missing SAP payments"
        trend={missingPayments > 0 ? "danger" : "up"}
      />

      <KPICard
        title="Unbalanced Journals"
        value={unbalancedJournals}
        change="Journals not balanced"
        trend={unbalancedJournals > 0 ? "danger" : "up"}
      />
    </div>
  );
};

export default AccountingKPIs;

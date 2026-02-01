import React from "react";
import KPICard from "../common/KPICard";
import KPICardSkeleton from "../dashboard/KPICardSkeleton";

import { safeNum, formatMoney } from "../../utils/numberUtils";

const AccountingKPIs = ({ summary, loading }) => {
  // Skeleton mientras carga o no hay summary
  if (loading || !summary) {
    return (
      <div className="kpi-cards">
        {Array.from({ length: 8 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ===== Numbers =====
  const settlements = safeNum(summary.settlementsCount);
  const pending = safeNum(summary.pendingCount);

  const amazonTotal = safeNum(summary.amazonTotal);
  const sapPaymentsTotal = safeNum(summary.sapPaymentsTotal);
  const diffPaymentsTotal = safeNum(summary.diffPaymentsTotal);

  const missingJournal = safeNum(summary.missingJournalCount);
  const missingPayments = safeNum(summary.missingPaymentsCount);
  const unbalancedJournals = safeNum(summary.unbalancedJournalCount);

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

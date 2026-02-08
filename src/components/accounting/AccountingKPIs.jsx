import React, { useMemo } from "react";
import KPICard from "../common/KPICard";
import KPICardSkeleton from "../dashboard/KPICardSkeleton";
import { computeAccountingKpis } from "../../utils/accountingKpis";

const AccountingKPIs = ({ summary, rows = [], loading }) => {
  const hasRows = Array.isArray(rows) && rows.length > 0;

  const kpi = useMemo(
    () => computeAccountingKpis({ rows, summary }),
    [rows, summary]
  );

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
    missingJournal,
    missingPayments,
    unbalancedJournals,
    formatted,
    amazonTotal,
    sapPaymentsTotal,
    diffPaymentsTotal,
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
        value={formatted.amazonTotal}
        change="Amazon total amount"
        trend={amazonTotal < 0 ? "danger" : "neutral"}
      />

      <KPICard
        title="SAP payments total"
        value={formatted.sapPaymentsTotal}
        change="Total paid in SAP"
        trend={sapPaymentsTotal < 0 ? "danger" : "neutral"}
      />

      <KPICard
        title="Payments diff total"
        value={formatted.diffPaymentsTotal}
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
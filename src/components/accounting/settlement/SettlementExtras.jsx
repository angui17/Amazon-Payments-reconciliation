import React from "react";
import ChartCard from "../../common/ChartCard";
import SettlementBarsByType from "../../charts/Accounting/settlement/SettlementBarsByType";
import SettlementParetoByDescription from "../../charts/Accounting/settlement/SettlementParetoByDescription";
import SettlementSapPayments from "../../charts/Accounting/settlement/SettlementSapPayments";

const SettlementExtras = ({ details, summary, loading }) => {
  const breakdownByType = details?.breakdownByType || [];
  const breakdownByAmountDescription = details?.breakdownByAmountDescription || [];
  const sapPayments = details?.sapPayments || [];
  const sapPaymentsCount = Number(summary?.sapPaymentsCount || 0);

  if (!loading && !details) return null;

  return (
    <>
      <div className="charts-grid">
        <ChartCard
          title="Breakdown by Type"
          subtitle="Absolute amount by type"
          loading={loading}
          skeletonClass="chart-skeleton-bars"
        >
          <SettlementBarsByType data={breakdownByType} />
        </ChartCard>

        <ChartCard
          title="Top Causes (Pareto)"
          subtitle="Absolute amount by description"
          loading={loading}
          skeletonClass="chart-skeleton-bars"
        >
          <SettlementParetoByDescription data={breakdownByAmountDescription} />
        </ChartCard>
      </div>

      <div style={{ marginTop: "10px" }}>

        <SettlementSapPayments
          loading={loading}
          sapPayments={sapPayments}
          sapPaymentsCount={sapPaymentsCount}
        />
      </div>
    </>
  );
};

export default SettlementExtras;

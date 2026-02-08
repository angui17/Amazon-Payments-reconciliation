import React from "react";
import ChartCard from "../../common/ChartCard";
import ChartCardSkeleton from "../../dashboard/ChartCardSkeleton"
import BreakdownByAmountDescriptionChart from "../../charts/Errors/BreakdownByAmountDescriptionChart";
import BreakdownByTypeChart from "../../charts/Errors/BreakdownByTypeChart";

const SettlementBreakdownsCharts = ({
  breakdownByAmountDescription = [],
  breakdownByType = [],
  loading = false,
}) => {
  return (
    <div className="charts-grid">
      {loading ? (
        <>
          <ChartCardSkeleton title="Breakdown by Amount Description" variant="chart-skeleton-bars" />
          <ChartCardSkeleton title="Breakdown by Type" variant="chart-skeleton-breakdown" />
        </>
      ) : (
        <>
          <ChartCard
            title="Breakdown by Amount Description"
            subtitle="Sum of amounts per description"
            loading={loading}
            skeletonClass="chart-skeleton-bars"
          >
            <BreakdownByAmountDescriptionChart data={breakdownByAmountDescription} />
          </ChartCard>

          <ChartCard
            title="Breakdown by Type"
            subtitle="Abs(amount) distribution by type"
            loading={loading}
            skeletonClass="chart-skeleton-breakdown"
          >
            <BreakdownByTypeChart data={breakdownByType} />
          </ChartCard>
        </>
      )}
    </div>
  );
};

export default SettlementBreakdownsCharts;

import React from "react";
import ChartCard from "../../common/ChartCard";
import AccountingBreakdownByDescriptionBar from "../../charts/Accounting/AccountingBreakdownByDescriptionBar";
import AccountingBreakdownByTypeBar from "../../charts/Accounting/AccountingBreakdownByTypeBar";

const AccountingSettlementBreakdownsCharts = ({
    loading,
    breakdownByAmountDescription = [],
    breakdownByType = [],
}) => {
    const hasData =
        (breakdownByAmountDescription?.length ?? 0) > 0 ||
        (breakdownByType?.length ?? 0) > 0;

    if (!loading && !hasData) return null;

    return (
        <div className="charts-grid">
            <ChartCard
                title="Breakdown by Amount Description"
                subtitle="Total amount grouped by description"
                loading={loading}
                skeletonClass="chart-skeleton-bars"
            >
                <AccountingBreakdownByDescriptionBar data={breakdownByAmountDescription} />
            </ChartCard>

            <ChartCard
                title="Breakdown by Type"
                subtitle="Total amount grouped by transaction type"
                loading={loading}
                skeletonClass="chart-skeleton-bars"
            >
                <AccountingBreakdownByTypeBar data={breakdownByType} />
            </ChartCard>
        </div>
    );
};

export default AccountingSettlementBreakdownsCharts;

import React, { useMemo } from "react";
import ChartCard from "../common/ChartCard";
import AccountingByDayLine from "../charts/Accounting/AccountingByDayLine";
import AccountingFlagsBars from "../charts/Accounting//AccountingFlagsBars";

const AccountingCharts = ({ charts, loading }) => {
    const byDay = useMemo(() => charts?.byDay || [], [charts]);
    const flagsCounts = useMemo(() => charts?.flagsCounts || [], [charts]);

    const hasData = byDay.length || flagsCounts.length;

    if (!loading && !hasData) return null;

    return (
        <div className="charts-grid">
            <ChartCard
                title="Payments & Journal by day"
                subtitle="Amazon vs SAP + diffs"
                loading={loading}
                skeletonClass="chart-skeleton-line"
            >
                <AccountingByDayLine data={byDay} />
            </ChartCard>

            <ChartCard
                title="Flags"
                subtitle="Missing / unbalanced indicators"
                loading={loading}
                skeletonClass="chart-skeleton-bars"
            >
                <AccountingFlagsBars data={flagsCounts} />
            </ChartCard>
        </div>
    );
};

export default AccountingCharts;

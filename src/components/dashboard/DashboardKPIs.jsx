import React from "react";
import KPICard from "../common/KPICard";
import "../../styles/kpi.css";
import KPICardSkeleton from "./KPICardSkeleton"

const money = (n) => {
    const num = Number(n || 0);
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const DashboardKPIs = ({ summary }) => {
    if (!summary) {
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
    } = summary;

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
                title="Pending (Status=P)"
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

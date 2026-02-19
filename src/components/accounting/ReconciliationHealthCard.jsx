import React, { useMemo } from "react";
import "../../styles/kpi.css"

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const scoreTrend = (pct) => {
    if (pct > 90) return "success";
    if (pct >= 75) return "warning";
    return "danger";
};

const ReconciliationHealthCard = ({ summary, loading }) => {
    const data = useMemo(() => {
        const settlementsCount = Number(summary?.settlementsCount ?? 0);
        const missingPaymentsCount = Number(summary?.missingPaymentsCount ?? 0);
        const missingJournalCount = Number(summary?.missingJournalCount ?? 0);
        const unbalancedJournalCount = Number(summary?.unbalancedJournalCount ?? 0);

        const issues = missingPaymentsCount + missingJournalCount + unbalancedJournalCount;

        const raw =
            settlementsCount > 0
                ? ((settlementsCount - issues) / settlementsCount) * 100
                : 0;

        const healthScore = Math.round(clamp(raw, 0, 100));
        const trend = scoreTrend(healthScore);

        return { settlementsCount, issues, healthScore, trend };
    }, [summary]);

    if (loading) {
        return (
            <div className="card" style={{ padding: 16, marginBottom: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 6, color: "#cc5500" }}>
                    Reconciliation Health
                </div>
                <div style={{ opacity: 0.7 }}>Loading…</div>
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div
            className={`card health-card health-${data.trend}`}
            style={{ padding: 16, marginBottom: 14 }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                    <div style={{ fontWeight: 800, color: "#cc5500" }}>Reconciliation Health</div>
                    <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                        Based on missing payments, missing journals, and unbalanced journals
                    </div>
                </div>

                <div style={{ textAlign: "right" }}>
                    <div className="health-score">
                        {data.healthScore}%
                    </div>

                    <div className="health-meta">
                        Issues: {data.issues} / {data.settlementsCount}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReconciliationHealthCard;

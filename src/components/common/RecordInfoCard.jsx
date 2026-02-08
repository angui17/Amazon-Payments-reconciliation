import React, { useMemo } from "react";
import StatusBadge from "./StatusBadge";
import { onlyDate } from "../../utils/dateUtils";
import "../../styles/settlement.css";

const prettyKey = (k) =>
    String(k)
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toLowerCase()
        .replace(/(^|\s)\S/g, (c) => c.toUpperCase());

const isDateKey = (k) => {
    const key = String(k || "").toLowerCase();
    return key.includes("date") || key.includes("start") || key.includes("end");
};

const isMoneyKey = (k) => {
    const key = String(k || "").toUpperCase();
    return (
        key.includes("TOTAL") ||
        key.includes("AMOUNT") ||
        key.includes("DEBIT") ||
        key.includes("CREDIT") ||
        key.includes("PAYMENT") ||
        key.includes("FEE") ||
        key === "DIFF" ||
        key.includes("DIFFERENCE")
    );
};

const fmtMoney = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v ?? "");
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtValue = (k, v) => {
    if (v === null || v === undefined || v === "") return "—";
    if (typeof v === "boolean") return v ? "Yes" : "No";
    if (isDateKey(k)) return onlyDate(v);
    if (isMoneyKey(k)) return fmtMoney(v);
    return String(v);
};

//  status -> badge
const defaultStatusMapper = (v) => {
    const code = String(v || "").toUpperCase();
    if (code === "P") return { label: "Pending", badge: "pending" };
    if (code === "C") return { label: "Completed", badge: "success" };
    return { label: String(v ?? "—"), badge: null };
};

const RecordInfoCard = ({
    record,
    title = "Details",
    subtitle = "Key fields for the selected record.",
    statusKey = "status",
    statusMapper = defaultStatusMapper,
    hiddenKeys = [],
}) => {
    const entries = useMemo(() => {
        if (!record) return [];
        const hidden = new Set(hiddenKeys.map((k) => String(k).toLowerCase()));
        return Object.entries(record).filter(([k]) => !hidden.has(String(k).toLowerCase()));
    }, [record, hiddenKeys]);

    if (!record) {
        return (
            <div className="chart-card">
                <div className="chart-title">No data loaded</div>
                <div className="chart-subtitle">
                    You opened this page directly or refreshed it. Next step: fetch by id.
                </div>
            </div>
        );
    }

    return (
        <div className="chart-card">
            <div className="chart-title">{title}</div>
            <div className="chart-subtitle">{subtitle}</div>

            <div className="settlement-kv">
                {entries.map(([k, v]) => {
                    const value = fmtValue(k, v);
                    const isStatus = String(k).toLowerCase() === String(statusKey).toLowerCase();

                    return (
                        <div key={k} className="settlement-kv-item" title={value}>
                            <div className="settlement-kv-key">{prettyKey(k)}</div>
                            <div className="settlement-kv-value">
                                {isStatus ? (
                                    (() => {
                                        const s = statusMapper(v);
                                        return s.badge ? (
                                            <StatusBadge status={s.badge}>{s.label}</StatusBadge>
                                        ) : (
                                            s.label
                                        );
                                    })()
                                ) : (
                                    value
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecordInfoCard;

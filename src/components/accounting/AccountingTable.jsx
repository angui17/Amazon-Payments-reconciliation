import React from "react";
import { Link } from "react-router-dom";

import AccountingTableHeaders from "./AccountingTableHeaders";
import "../../styles/settlementsTable.css";

import { safeNum, formatMoney } from "../../utils/numberUtils";
import { STATUS_LABELS } from "../../utils/status";

const statusClass = (code) => {
    if (code === "C") return "status-success";
    if (code === "P") return "status-warning";
    return "status-neutral";
};

const diffClass = (n) => {
    const v = Number(n ?? 0);
    if (v === 0) return "diff-ok";
    return v < 0 ? "diff-bad" : "diff-warn";
};

const AccountingTable = ({ rows = [], onDetails }) => {
    if (!rows.length) {
        return (
            <div className="card table-card" style={{ padding: 14 }}>
                <div className="empty-row">No settlements found for the selected filters.</div>
            </div>
        );
    }

    return (
        <div className="card table-card">
            <div className="table-header" style={{ padding: 14 }}>
                <h3>Settlements</h3>
                <div className="table-meta">{rows.length} rows</div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <AccountingTableHeaders />

                    <tbody>
                        {rows.map((r) => {
                            const diff = Number(r.diffPayments ?? 0);

                            const flags = [];
                            if (safeNum(r.missingJournal) === 1)
                                flags.push({ label: "Missing Journal", type: "flag-warning" });
                            if (safeNum(r.missingPayments) === 1)
                                flags.push({ label: "Missing Payments", type: "flag-danger" });

                            return (
                                <tr key={r.settlementId}>
                                    <td className="mono">
                                        <Link
                                            to={`/settlements/${r.settlementId}`}
                                            state={{ row: r }}
                                            className="link-settlement"
                                        >
                                            {r.settlementId}
                                        </Link>
                                    </td>
                                    <td>{r.depositDateDate}</td>

                                    <td className={`th-center ${Number(r.amazonTotalReported) < 0 ? "negative" : ""}`}>
                                        {formatMoney(r.amazonTotalReported)}
                                    </td>

                                    <td className={`th-center ${Number(r.sapPaymentsTotal) < 0 ? "negative" : ""}`}>
                                        {formatMoney(r.sapPaymentsTotal)}
                                    </td>

                                    <td className={`th-center ${diffClass(diff)} ${diff < 0 ? "negative" : ""}`}>
                                        {formatMoney(diff)}
                                    </td>

                                    <td className="th-center">{safeNum(r.sapJournalEntriesCount)}</td>

                                    <td className={`th-center ${Number(r.sapJournalTotalDebit) < 0 ? "negative" : ""}`}>
                                        {formatMoney(r.sapJournalTotalDebit)}
                                    </td>

                                    <td className={`th-center ${Number(r.sapJournalTotalCredit) < 0 ? "negative" : ""}`}>
                                        {formatMoney(r.sapJournalTotalCredit)}
                                    </td>

                                    <td className="th-center">
                                        {safeNum(r.journalBalanced) === 1 ? "✅" : "⚠️"}
                                    </td>

                                    <td className="th-center">
                                        {flags.length ? (
                                            <div className="flags-wrap" style={{ justifyContent: "center" }}>
                                                {flags.map((f) => (
                                                    <span key={f.label} className={`flag-badge ${f.type}`}>
                                                        {f.label}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="muted">—</span>
                                        )}
                                    </td>

                                    <td className="th-center">
                                        <span className={`status-pill ${statusClass(r.status)}`}>
                                            {STATUS_LABELS?.[r.status] || r.status}
                                        </span>
                                    </td>

                                    <td className="th-center">
                                        <button className="btn btn-sm" onClick={() => onDetails?.(r)}>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="empty-row">
                                    No accounting found for selected filters.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default AccountingTable;

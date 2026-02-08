import React from "react";
import {
    money,
    onlyYMD,
    formatPeriod,
    mapStatus,
    diffClass,
    isReconciled,
} from "../../utils/settlementsTableUtils";

import "../../styles/settlements-table.css";
import { Link } from "react-router-dom";

const StatusPill = ({ status }) => {
    const { label, className } = mapStatus(status);
    return <span className={`status-pill ${className}`}>{label}</span>;
};

const SettlementsTable = ({ rows = [], onDetails, onExportPdf }) => {
    return (
        <div className="card table-card">
            <div className="card-header table-header">
                <h3>Settlements</h3>
                <div className="table-meta">{rows.length} results</div>

                {onExportPdf ? (
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => onExportPdf?.()}
                        disabled={rows.length === 0}
                        type="button"
                        title={rows.length === 0 ? "No rows to export" : "Export current page to PDF"}
                    >
                        Export PDF
                    </button>
                ) : null}
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Settlement ID</th>
                            <th>Deposit Date</th>
                            <th>Period</th>
                            <th className="th-center">Amazon Total</th>
                            <th className="th-center">SAP Total</th>
                            <th className="th-center">Diff</th>
                            <th className="th-center">Reconciled</th>
                            <th className="th-center">Exceptions</th>
                            <th>Status</th>
                            <th className="th-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((r, idx) => (
                            <tr key={`${r.settlementId ?? "row"}-${idx}`}>
                                <td className="mono">
                                    <Link to={`/dashboard/settlements/${r.settlementId}`} state={{ row: r }} className="link-settlement">
                                        {r.settlementId ?? "-"}
                                    </Link>
                                </td>
                                <td>{r.depositDateDate ?? onlyYMD(r.depositDate)}</td>
                                <td className="muted">
                                    {formatPeriod(r.settlementStart, r.settlementEnd)}
                                </td>
                                <td className="th-center">{money(r.amazonTotalReported)}</td>
                                <td className="th-center">{money(r.sapPaymentsTotal)}</td>
                                <td className={`th-center ${diffClass(r.difference)} ${Number(r.difference) < 0 ? "negative" : ""}`} >
                                    {money(r.difference)}
                                </td>
                                <td className="th-center">{isReconciled(r.reconciled)}</td>
                                <td className="th-center">{r.exceptionsCount ?? 0}</td>
                                <td><StatusPill status={r.status} /></td>
                                <td className="th-center">
                                    <button className="btn btn-sm" onClick={() => onDetails?.(r)} >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={10} className="empty-row">
                                    No settlements found for selected filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SettlementsTable;

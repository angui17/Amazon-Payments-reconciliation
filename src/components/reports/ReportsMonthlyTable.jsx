import React, { useMemo } from "react";
import ReportsMonthlyTableHeaders from "./ReportsMonthlyTableHeaders";
import { money, int, pct, formatMonth, diffClass } from "../../utils/kpicards";
import { effectiveStatusFromNotReconciledCount, mapStatus } from "../../utils/settlementsTableUtils";

import "../../styles/settlements-table.css";

const ReportsMonthlyTable = ({ rows = [], onViewDetails, onExportPdf }) => {
    const safeRows = useMemo(() => (Array.isArray(rows) ? rows : []), [rows]);

    const StatusPill = ({ status }) => {
        const { label, className } = mapStatus(status);
        return <span className={`status-pill ${className}`}>{label}</span>;
    };

    return (
        <div className="card table-card">
            <div className="table-header" style={{ padding: 14 }}>
                <h3>Reports</h3>
                <div style={{ display: "flex" }}>
                    <div className="table-meta" style={{ margin: "10px" }}>
                        {rows.length} results
                    </div>
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
            </div>

            <div className="data-table">
                <table>
                    <ReportsMonthlyTableHeaders />
                    <tbody>
                        {safeRows.length === 0 ? (
                            <tr>
                                <td colSpan={10} style={{ textAlign: "center", padding: 12 }}>
                                    No data
                                </td>
                            </tr>
                        ) : (
                            safeRows.map((r, idx) => {
                                const diff = Number(r.differenceTotal);
                                const isNegative = Number.isFinite(diff) && diff < 0;

                                const total = int(r.settlementsCount);
                                const reconciled = int(r.reconciledCount);
                                const notRec = int(r.notReconciledCount);

                                const status = effectiveStatusFromNotReconciledCount(notRec);
                                const computedPending = notRec === 0 ? 0 : notRec;

                                return (
                                    <tr key={r.month ?? idx}>
                                        <td>{formatMonth(r.month)}</td>
                                        <td className="th-center">{total}</td>
                                        <td>{money(r.amazonTotal)}</td>
                                        <td>{money(r.sapTotal)}</td>
                                        <td className={`th-center ${diffClass(r.differenceTotal)} ${isNegative ? "negative" : ""}`}>
                                            {money(r.differenceTotal)}
                                        </td>

                                        <td className="th-center">{reconciled}</td>
                                        <td className="th-center">{notRec}</td>
                                        <td className="th-center">{computedPending}</td>
                                        <td>{pct(r.reconciledPct)}</td>
                                        <td className="th-center">
                                            <StatusPill status={status} />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsMonthlyTable;

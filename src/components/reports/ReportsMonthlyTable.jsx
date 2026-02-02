import React, { useMemo } from "react";
import ReportsMonthlyTableHeaders from "./ReportsMonthlyTableHeaders";
import { money, int, pct, formatMonth, diffClass } from "../../utils/kpicards";
import "../../styles/settlements-table.css"

const ReportsMonthlyTable = ({ rows = [], onViewDetails }) => {
    const safeRows = useMemo(() => (Array.isArray(rows) ? rows : []), [rows]);

    return (
        <div className="card table-card">
            <div className="table-header" style={{ padding: 14 }}>
                <h3>Reports</h3>
                <div className="table-meta">{rows.length} rows</div>
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

                                return (
                                    <tr key={r.month ?? idx}>
                                        <td>{formatMonth(r.month)}</td>
                                        <td>{int(r.settlementsCount)}</td>
                                        <td>{money(r.amazonTotal)}</td>
                                        <td>{money(r.sapTotal)}</td>
                                        <td className={`th-center mono ${diffClass(r.differenceTotal)} ${isNegative ? "negative" : ""}`}>
                                            {money(r.differenceTotal)}
                                        </td>
                                        <td className="th-center">{int(r.reconciledCount)}</td>
                                        <td>{int(r.notReconciledCount)}</td>
                                        <td>{int(r.pendingCount)}</td>
                                        <td>{pct(r.reconciledPct)}</td>
                                        <td className="th-center">
                                            <button className="btn btn-sm" onClick={() => onDetails?.(r)}>
                                                Details
                                            </button>
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

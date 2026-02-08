import React from "react";
import SettlementErrorsDetailTableHeaders from "./SettlementErrorsDetailTableHeaders";
import "../../../styles/settlements-table.css";

const money = (n) => {
    const num = Number(n ?? 0);
    return `$${num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const StatusPill = ({ status }) => {
    const s = String(status || "-").toUpperCase();
    const label = s === "P" ? "Pending" : s === "C" ? "Completed" : s;

    const cls =
        s === "C"
            ? "status-success"
            : s === "P"
                ? "status-warning"
                : "status-neutral";

    return <span className={`status-pill ${cls}`}>{label}</span>;
};

const SettlementErrorsDetailTable = ({ rows = [] }) => {
    return (
        <div className="card table-card" style={{ marginTop: 16 }}>
            <div className="card-header table-header">
                <h3>Settlement Errors Detail</h3>
                <div className="table-meta">{rows.length} results</div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <SettlementErrorsDetailTableHeaders />

                    <tbody>
                        {rows.map((r, idx) => {
                            const posted = r.POSTED_DATE_DATE || r.POSTED_DATE || "-";
                            const orderId = r.ORDER_ID ?? "-";
                            const sku = r.sku ?? "-";
                            const orderItem = r["order-item"] ?? "-";
                            const type = r.TYPE ?? "-";
                            const desc = r.AMOUNT_DESCRIPTION ?? "-";
                            const amount = Number(r.amount ?? 0);
                            const total = Number(r["total-amount"] ?? 0);
                            const status = r.status ?? "-";

                            return (
                                <tr key={`${r.id ?? "row"}-${idx}`}>
                                    <td>{posted}</td>
                                    <td className="mono">{orderId}</td>
                                    <td className="mono">{sku}</td>
                                    <td className="mono">{orderItem}</td>
                                    <td>{type}</td>
                                    <td>{desc}</td>
                                    <td className={`th-center ${amount < 0 ? "negative" : ""}`}>
                                        {money(amount)}
                                    </td>
                                    <td className={`th-center ${total < 0 ? "negative" : ""}`}>
                                        {money(total)}
                                    </td>
                                    <td className="th-center">
                                        <StatusPill status={status} />
                                    </td>
                                </tr>
                            );
                        })}

                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="empty-row">
                                    No detail rows found.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SettlementErrorsDetailTable;

import React from "react";

import StatusBadge from "../../ui/StatusBadge";
import { formatMoney } from "../../../utils/refundMath";

const cell = (v) => (v === null || v === undefined || v === "" ? "—" : String(v));

const SalesFeesTable = ({ rows = [], onView = () => { } }) => {
    if (!rows || rows.length === 0) {
        return (
            <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: 20 }}>
                    No orders found
                </td>
            </tr>
        )
    }

    return (
        <>
            {rows.map((r, idx) => {
                const date = r.DATE || (r.DATE_TIME ? String(r.DATE_TIME).slice(0, 10) : "");
                const settlementId = r.SETTLEMENT_ID;
                const type = r.TYPE;
                const desc = r.DESCRIPTION;
                const account = r.ACCOUNT_TYPE;
                const marketplace = r.MARKETPLACE;
                const total = r.TOTAL ?? r.total ?? 0;
                const status = r.STATUS ?? r.status;
                const sku = r.SKU ?? r.sku;
                const orderId = r.ORDER_ID ?? r.order_id;

                return (
                    <tr key={r.ID_UNIQUE ?? idx}>
                        <td>{cell(date)}</td>
                        <td>{cell(settlementId)}</td>
                        <td>{cell(sku)}</td>
                        <td>{cell(orderId)}</td>
                        <td>{cell(type)}</td>

                        <td
                            title={desc || ""}
                            style={{
                                maxWidth: 260,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {cell(desc)}
                        </td>

                        <td>{cell(account)}</td>
                        <td>{cell(marketplace)}</td>

                        <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                            {formatMoney(total)}
                        </td>

                        <td>
                            <StatusBadge status={status} />
                        </td>

                        <td style={{ textAlign: "right" }}>
                            <button
                                className="btn btn-sm"
                                onClick={() => onView(r)}
                                style={{ padding: "6px 10px" }}
                            >
                                Details
                            </button>
                        </td>
                    </tr>
                );
            })}
        </>
    );
};

export default SalesFeesTable;

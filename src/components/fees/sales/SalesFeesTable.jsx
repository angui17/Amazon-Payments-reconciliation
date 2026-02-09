import React from "react";

import StatusBadge from "../../ui/StatusBadge";
import { formatMoney } from "../../../utils/refundMath";

import SalesFeesTableHeaders from "./SalesFeesTableHeaders";
import SalesFeesTableSkeleton from "./SalesFeesTableSkeleton";
import "../../../styles/settlements-table.css";

const cell = (v) => (v === null || v === undefined || v === "" ? "—" : String(v));

const SalesFeesTable = ({
    title = "Sales Fees",
    rows = [],
    loading = false,
    totalItems = 0,
    pageSize = 10,
    onView = () => { },
    onExportPdf,
}) => {
    return (
        <div className="data-table">
            {/* Header + meta */}
            <div className="table-header">
                <h3>{title}</h3>

                <div className="table-header-right">
                    <div className="table-meta">
                        {loading ? "Loading..." : `${totalItems} results • showing ${rows.length}`}
                    </div>

                    {onExportPdf ? (
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={() => onExportPdf?.()}
                            disabled={loading || rows.length === 0}
                            type="button"
                            title={rows.length === 0 ? "No rows to export" : "Export current page to PDF"}
                        >
                            Export PDF
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="table">
                    <SalesFeesTableHeaders />

                    <tbody>
                        {/* Skeleton / Empty */}
                        <SalesFeesTableSkeleton
                            loading={loading}
                            dataLength={totalItems}
                            colSpan={11}
                            rows={pageSize}
                            emptyMessage="No fees found"
                        />

                        {/* Rows */}
                        {!loading &&
                            rows.length > 0 &&
                            rows.map((r, idx) => {
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
                                    <tr key={r.ID_UNIQUE ?? `${orderId || "row"}-${idx}`}>
                                        <td>{cell(date)}</td>
                                        <td>{cell(sku)}</td>
                                        <td>{cell(orderId)}</td>
                                        <td>{cell(settlementId)}</td>
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

                                        <td
                                            className={total < 0 ? "negative th-right" : "th-right"}
                                            style={{ fontVariantNumeric: "tabular-nums" }}
                                        >
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
                                                type="button"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesFeesTable;
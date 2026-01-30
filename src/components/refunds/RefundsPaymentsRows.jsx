import React from "react";
import { onlyDate } from "../../utils/dateUtils";

const RefundsPaymentsRows = ({ payments = [], onDetails }) => {
  return (
    <>
      {payments.map((p) => {
        const posted = p.POSTED_DATE_DATE || p.POSTED_DATE || "-";
        const settlementId = p.SETTLEMENT_ID || p.settlementId || p.id || "-";
        const startDate = p["settlement-start-date"] || p.settlementStartDate || "-";
        const endDate = p["settlement-end-date"] || p.settlementEndDate || "-";
        const orderId = p.ORDER_ID || p.order_id || "-";
        const reason = p.AMOUNT_DESCRIPTION || "-";
        const amount = typeof p.amount === "number" ? p.amount : null;
        const status = p.status || p.STATUS || "-";

        const rowKey = [p.id, orderId, p.sku || p.SKU, reason, posted, amount].filter(Boolean).join("|");

        return (
          <tr key={rowKey}>
            {/* Created Date */}
            <td>{onlyDate(posted)}</td>

            {/* SKU */}
            <td>{p.sku || p.SKU || "-"}</td>

            {/* Settlement ID */}
            <td>{settlementId}</td>

            {/* Settlement Start Date */}
            <td className="text-center">{onlyDate(startDate)}</td>

            {/* Settlement End Date */}
            <td>{onlyDate(endDate)}</td>

            {/* Order ID */}
            <td>{orderId}</td>

            {/* Reason */}
            <td>{reason}</td>

            {/* Amount */}
            <td className={amount !== null && amount < 0 ? "text-negative" : ""}>
              {amount === null ? "-" : `$${amount.toFixed(2)}`}
            </td>

            {/* Status */}
            <td>
              <span className={`status-badge ${status === "P" ? "status-pending" : "status-success"}`}>
                {status === "P" ? "Pending" : "Completed"}
              </span>
            </td>

            {/* Actions */}
            <td className="action-buttons">
              <button
                className="action-btn action-view"
                onClick={() => onDetails?.(p)}
                type="button"
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

export default RefundsPaymentsRows;

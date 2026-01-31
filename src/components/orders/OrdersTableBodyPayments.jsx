import React from "react";
import { toNumber } from "../../utils/refundMath";
import StatusBadge from "../ui/StatusBadge";

const getAmount = (row) =>
  toNumber(row.AMOUNT ?? row.amount ?? row["AMOUNT"] ?? 0);

const OrdersTableBodyPayments = ({ rows = [], onView }) => {
  if (!rows || rows.length === 0) {
    return (
      <tr>
        <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
          No payments found
        </td>
      </tr>
    );
  }

  return (
    <>
      {rows.map((row, idx) => {
        const amount = getAmount(row);
        const totalAmount = toNumber(
          row["total-amount"] ?? row.TOTAL_AMOUNT ?? row.total_amount ?? 0
        );

        return (
          <tr key={`${row.ORDER_ID || row.order_id}-${idx}`}>
            <td>{row.ORDER_ID || row.order_id || "-"}</td>
            <td>{row.SKU || row.sku || "-"}</td>
            <td>{row.POSTED_DATE || row.posted_date || "-"}</td>
            <td>{row.AMOUNT_DESCRIPTION || row.description || "-"}</td>

            {/* Amount */}
            <td
              style={{
                color: amount < 0 ? "#dc2626" : "inherit",
                fontWeight: amount < 0 ? 600 : "normal",
              }}
            >
              {amount !== 0 ? `$${amount.toFixed(2)}` : "-"}
            </td>

            {/* Status */}
            <td>
              <StatusBadge status={row.STATUS || row.status} />
            </td>


            {/* Actions */}
            <td>
              <button className="btn btn-sm" onClick={() => onView?.(row)}>
                Details
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default OrdersTableBodyPayments;

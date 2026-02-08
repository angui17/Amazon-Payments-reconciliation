import React from "react";
import { toNumber, formatMoney } from "../../utils/refundMath";

const STATUS_LABEL = {
  C: "Completed",
  P: "Pending",
};

const statusClass = (status) =>
  status === "C" ? "status-success" : "status-pending";

const RefundsSalesRows = ({ refunds = [], onDetails }) => {
  return (
    <>
      {refunds.map((r, idx) => {
        const productSales = toNumber(r.PRODUCT_SALES);
        const total = toNumber(r.TOTAL);

        return (
          <tr key={`${r.order_id || "row"}-${idx}`}>
            {/* Date */}
            <td>{r.DATE || "—"}</td>

            {/* Settlement */}
            <td>{r.SETTLEMENT_ID || "—"}</td>

            {/* Order */}
            <td>{r.order_id || "—"}</td>

            {/* SKU + Product */}
            <td>
              <div>{r.SKU || "—"}</div>

              {r.DESCRIPTION && (
                <div className="sku-details">
                  <div className="sku-info">
                    <span className="sku-label">Product:</span>
                    <span className="sku-value">
                      {String(r.DESCRIPTION).toLowerCase()}
                    </span>
                  </div>
                </div>
              )}
            </td>

            {/* Quantity */}
            <td className="text-center">{r.QUANTITY ?? "—"}</td>

            {/* Product Sales */}
            <td className={productSales < 0 ? "text-negative" : ""}>
              {formatMoney(productSales)}
            </td>

            {/* Total */}
            <td className={total < 0 ? "text-negative" : ""}>
              {formatMoney(total)}
            </td>

            {/* Status */}
            <td>
              <span className={`status-badge ${statusClass(r.STATUS)}`}>
                {STATUS_LABEL[r.STATUS] || r.STATUS || "—"}
              </span>
            </td>

            {/* Actions */}
            <td className="action-buttons">
              <button
                type="button"
                className="action-btn action-view"
                onClick={() => onDetails?.(r)}
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

export default RefundsSalesRows;
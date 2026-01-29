import React from "react";

const RefundsSalesRows = ({ refunds, onDetails }) => {
  return (
    <>
      {refunds.map((r, idx) => (
        <tr key={idx}>
          <td>{r.DATE}</td>
          <td>{r.SETTLEMENT_ID}</td>
          <td>{r.order_id}</td>
          <td>
            <div>{r.SKU}</div>
            <div className="sku-details">
              <div className="sku-info">
                <span className="sku-label">Product:</span>
                <span className="sku-value">{r.DESCRIPTION?.toLowerCase()}</span>
              </div>
            </div>
          </td>
          <td className="text-center">{r.QUANTITY}</td>
          <td className={r.PRODUCT_SALES < 0 ? "text-negative" : ""}>${r.PRODUCT_SALES}</td>
          <td className={r.TOTAL < 0 ? "text-negative" : ""}>${r.TOTAL}</td>      
          <td>
            <span className={`status-badge ${r.STATUS === "C" ? "status-success" : "status-pending"}`}>
              {r.STATUS === "C" ? "Completed" : r.STATUS}
            </span>
          </td>

          <td className="action-buttons">
            <button type="button" className="action-btn action-view" onClick={() => onDetails(r)}>
              Details
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default RefundsSalesRows;

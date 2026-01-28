import React from "react";

const RefundsSalesRows = ({ refunds }) => {
  return (
    <>
      {refunds.map((r, idx) => (
        <tr key={idx}>
          <td><input type="checkbox" /></td>
          <td>{r.ID_UNIQUE}</td>
          <td>{r.ORDER_ID}</td>
          <td>
            <div>{r.SKU}</div>
            <div className="sku-details">
              <div className="sku-info">
                <span className="sku-label">Product:</span>
                <span className="sku-value">{r.DESCRIPTION?.toLowerCase()}</span>
              </div>
            </div>
          </td>
          <td className={r.TOTAL < 0 ? "text-negative" : ""}>${r.TOTAL}</td>
          <td>{r.TYPE}</td>
          <td>
            <span className={`status-badge ${r.STATUS === "C" ? "status-success" : "status-pending"}`}>
              {r.STATUS === "C" ? "Completed" : r.STATUS}
            </span>
          </td>
          <td>{r.DATE}</td>
          <td className="action-buttons">
            <button className="action-btn action-view">View</button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default RefundsSalesRows;

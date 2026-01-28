import React from "react";

const RefundsPaymentsRows = ({ payments }) => {

  return (
    <>
      {payments.map((p, idx) => (
        <tr key={idx}>
          <td><input type="checkbox" /></td>
          <td>{p.order_id || p.ORDER_ID}</td>
          <td>{p.sku}</td>
          <td className={p.amount < 0 ? "text-negative" : ""}>
            ${p.amount?.toFixed(2)}
          </td>
          <td>{p.AMOUNT_DESCRIPTION}</td>
          <td>
            <span
              className={`status-badge ${p.status === "P" ? "status-pending" : "status-success"
                }`}
            >
              {p.status === "P" ? "Pending" : "Completed"}
            </span>
          </td>
          <td>{p["deposit-date"] || p.POSTED_DATE || "-"}</td>
          <td className="action-buttons">
            <button className="action-btn action-view">View</button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default RefundsPaymentsRows;

import React from "react";
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
  const cls = s === "C" ? "status-success" : s === "P" ? "status-warning" : "status-neutral";
  return <span className={`status-pill ${cls}`}>{label}</span>;
};

const AccountingSettlementDetailTable = ({ rows = [] }) => {
  return (
    <div className="card table-card" style={{ marginTop: 16 }}>
      <div className="card-header table-header">
        <h3>Settlement Accounting Detail</h3>
        <div className="table-meta">{rows.length} results</div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Posted date</th>
              <th>Order ID</th>
              <th >SKU</th>
              <th>Transaction type</th>
              <th>Amount description</th>
              <th className="th-center">Amount</th>
              <th className="th-center">Total</th>
              <th className="th-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => {
              const posted = r["posted-date"] ?? "-";
              const orderId = r["order-id"] ?? "-";
              const sku = r["sku"] ?? "-";
              const txType = r["transaction-type"] ?? "-";
              const desc = r["amount-description"] ?? "-";

              const amount = Number(r["amount"] ?? 0);
              const total = Number(r["total-amount"] ?? 0);
              const status = r["status"] ?? "-";

              return (
                <tr key={`${orderId}-${idx}`}>
                  <td>{posted}</td>
                  <td>{orderId}</td>
                  <td>{sku}</td>
                  <td>{txType}</td>
                  <td>{desc}</td>
                  <td className={`th-center ${amount < 0 ? "negative" : ""}`}>{money(amount)}</td>
                  <td className={`th-center ${total < 0 ? "negative" : ""}`}>{money(total)}</td>
                  <td className="th-center"><StatusPill status={status} /></td>
                </tr>
              );
            })}

            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-row">
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

export default AccountingSettlementDetailTable;
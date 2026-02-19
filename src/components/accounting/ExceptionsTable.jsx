import React from "react";
import "../../styles/settlements-table.css";

const ExceptionsTable = ({ title = "Missing fee account mappings", meta }) => {
  return (
    <div className="table-card" style={{ marginTop: 14 }}>
      <div className="table-header" style={{ padding: 14 }}>
        <div style={{ fontWeight: 700, color: "#cc5500" }}>{title}</div>
        <div className="table-meta">{meta ?? ""}</div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>SettlementId</th>
              <th>Description</th>
              <th className="th-center">EntryDate</th>
              <th className="th-right">Debit</th>
              <th className="th-right">Credit</th>
              <th className="th-right">TotalAmount</th>
            </tr>
          </thead>

          <tbody>
            {/* Por ahora vacío: después metemos rows */}
            <tr>
              <td colSpan={6} className="empty-row">
                No records.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExceptionsTable;

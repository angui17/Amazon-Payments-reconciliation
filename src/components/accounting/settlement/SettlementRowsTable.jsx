import React, { useMemo } from "react";
import SettlementRowsTableHeaders, { COLS } from "./SettlementRowsTableHeaders";
import StatusBadge from "../../common/StatusBadge";

const fmtMoney = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const mapStatus = (v) => {
  const code = String(v || "").toUpperCase();
  if (code === "P") return { label: "Pending", badge: "pending" };
  if (code === "C") return { label: "Completed", badge: "success" };
  return { label: code || "—", badge: "neutral" };
};

const getValue = (row, key) => row?.[key];

const SettlementRowsTable = ({ rows = [] }) => {
  const view = Array.isArray(rows) ? rows : [];

  if (!view.length) {
    return (
      <div className="orders-empty">
        No rows available for this settlement.
      </div>
    );
  }

  return (
    <div className="card table-card">
      <div className="table-header" style={{ padding: 14 }}>
        <h3>Settlements</h3>
        <div className="table-meta">{rows.length} rows</div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <SettlementRowsTableHeaders />

          <tbody>
            {view.map((r, idx) => {
              const amount = Number(getValue(r, "amount"));
              const total = Number(getValue(r, "total-amount"));
              const amountNeg = Number.isFinite(amount) && amount < 0;
              const totalNeg = Number.isFinite(total) && total < 0;

              return (
                <tr key={r["order-id"] || idx}>
                  {COLS.map((c) => {
                    const k = c.key;
                    const raw = getValue(r, k);

                    // special renderers
                    if (k === "amount") {
                      return (
                        <td key={k} className={`th-right ${amountNeg ? "negative" : ""}`}>
                          {fmtMoney(raw)}
                        </td>
                      );
                    }

                    if (k === "total-amount") {
                      return (
                        <td key={k} className={`th-right ${totalNeg ? "negative" : ""}`}>
                          {fmtMoney(raw)}
                        </td>
                      );
                    }

                    if (k === "status") {
                      const s = mapStatus(raw);
                      return (
                        <td key={k} className="th-center">
                          <StatusBadge status={s.badge}>{s.label}</StatusBadge>
                        </td>
                      );
                    }

                    return (
                      <td key={k} className={c.className || ""}>
                        {raw === "" || raw === null || raw === undefined ? "—" : String(raw)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettlementRowsTable;

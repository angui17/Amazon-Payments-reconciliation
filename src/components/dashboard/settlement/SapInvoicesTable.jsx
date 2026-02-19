import React from "react";
import SapInvoicesTableHeaders, { COLS } from "./SapInvoicesTableHeaders";
import { money } from "../../../utils/settlementsTableUtils";
import "../../../styles/settlements-table.css";

const fmtDate = (v) => {
  if (!v) return "—";
  const s = String(v);
  const d = s.split(" ")[0];
  return d || "—";
};

const getValue = (row, key) => row?.[key];

const SapInvoicesTable = ({ rows = [] }) => {
  const view = Array.isArray(rows) ? rows : [];

  if (!view.length) return null; // o un empty state

  return (
    <div className="card table-card" style={{ marginTop: 24 }}>
      <div className="table-header" style={{ padding: 14 }}>
        <h3>SAP Invoices</h3>
        <div className="table-meta">{view.length} rows</div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <SapInvoicesTableHeaders />
          <tbody>
            {view.map((r, idx) => {
              const key =
                r.paymentDocNum ||
                r.invoiceDocNum ||
                r.invoiceNumAtCard ||
                `${idx}`;

              const invoiceTotal = Number(getValue(r, "invoiceTotal"));
              const sumApplied = Number(getValue(r, "sumApplied"));
              const invNeg = Number.isFinite(invoiceTotal) && invoiceTotal < 0;
              const appNeg = Number.isFinite(sumApplied) && sumApplied < 0;

              return (
                <tr key={key}>
                  {COLS.map((c) => {
                    const k = c.key;
                    const raw = getValue(r, k);

                    if (k === "invoiceTotal") {
                      return (
                        <td key={k} className={`th-right ${invNeg ? "negative" : ""}`}>
                          {money(raw)}
                        </td>
                      );
                    }

                    if (k === "sumApplied") {
                      return (
                        <td key={k} className={`th-right ${appNeg ? "negative" : ""}`}>
                          {money(raw)}
                        </td>
                      );
                    }

                    if (k === "paymentDocDate") {
                      return <td key={k}>{fmtDate(raw)}</td>;
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

export default SapInvoicesTable;
import React from "react";
import StatusBadge from "../../ui/StatusBadge";
import { onlyDate } from "../../../utils/dateUtils";

const fmtAmount = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return String(v ?? "-");
  return n.toFixed(2);
};

const InpaymentsFeesTable = ({ rows = [], onView = () => {}  }) => {
  return (
    <>
      {rows.map((r, idx) => (
        <tr key={r.order_id ?? r.ORDER_ID ?? `${r.id}-${idx}`}>
          <td>{r.POSTED_DATE_DATE ?? r.POSTED_DATE ?? "-"}</td>
          <td>{r.ORDER_ID ?? r.order_id ?? "-"}</td>
          <td>{r.sku == "" ? "N/A" : r.sku}</td>
          <td>{r.id ?? "-"}</td>
          <td>{r.TYPE ?? "-"}</td>
          <td>{r.AMOUNT_DESCRIPTION ?? "-"}</td>
          <td
            style={{
              textAlign: "right",
              color: Number(r.amount) < 0 ? "#d32f2f" : "inherit",
              fontWeight: Number(r.amount) < 0 ? 600 : "normal",
            }}
          >
            {fmtAmount(r.amount)}
          </td>
          <td> <StatusBadge status={r.STATUS || r.status} /></td>
          <td>{onlyDate(r["settlement-start-date"])}</td>
          <td>{onlyDate(r["settlement-end-date"])}</td>
          <td style={{ textAlign: "right" }}>
            <button className="btn btn-sm" style={{ padding: "6px 10px" }} onClick={() => onView(r)}>
              Details
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default InpaymentsFeesTable;

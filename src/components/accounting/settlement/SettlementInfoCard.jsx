import React, { useMemo } from "react";
import "../../../styles/settlement.css";
import StatusBadge from "../../common/StatusBadge"

const prettyKey = (k) =>
  String(k)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());

const isMoneyKey = (k) => {
  const key = String(k || "").toUpperCase();
  return (
    key.includes("TOTAL") ||
    key.includes("AMOUNT") ||
    key.includes("DEBIT") ||
    key.includes("CREDIT") ||
    key.includes("PAYMENT") ||
    key.includes("FEE")
  );
};

const fmtMoney = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v ?? "");
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtValue = (k, v) => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (isMoneyKey(k)) return fmtMoney(v);
  return String(v);
};

const mapStatus = (v) => {
  const code = String(v || "").toUpperCase();

  if (code === "P") return { label: "Pending", badge: "pending" };
  if (code === "C") return { label: "Completed", badge: "success" };

  return { label: v, badge: null };
};

const SettlementInfoCard = ({ row, title = "Settlement data" }) => {
  const entries = useMemo(() => (row ? Object.entries(row) : []), [row]);

  if (!row) {
    return (
      <div className="chart-card">
        <div className="chart-title">No settlement data loaded</div>
        <div className="chart-subtitle">
          You opened this page directly or refreshed it. Next iteration: fetch by settlementId.
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-title">{title}</div>
      <div className="chart-subtitle">Key fields from the selected settlement.</div>

      <div className="settlement-kv">
        {entries.map(([k, v]) => {
          const value = fmtValue(k, v);
          return (
            <div key={k} className="settlement-kv-item" title={value}>
              <div className="settlement-kv-key">{prettyKey(k)}</div>
              <div className="settlement-kv-value">
                {k.toLowerCase() === "status" ? (
                  (() => {
                    const s = mapStatus(v);
                    return s.badge ? (
                      <StatusBadge status={s.badge}>{s.label}</StatusBadge>
                    ) : (
                      s.label
                    );
                  })()
                ) : (
                  value
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettlementInfoCard;

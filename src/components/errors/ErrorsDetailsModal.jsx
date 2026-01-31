import React, { useMemo } from "react";
import Modal from "../common/Modal";
import "../../styles/modal.css";

const TABLE_KEYS = new Set([
  "settlementId",
  "depositDateDate",
  "status",
  "amazonTotalReported",
  "sapPaymentsTotal",
  "difference",
  "flagDiff",
  "flagNoSap",
  "flagAmazonInternal",
]);

const money = (n) => {
  const num = Number(n ?? 0);
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const prettyKey = (k) =>
  String(k)
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());

const Flag = ({ tone = "neutral", children }) => (
  <span className={`flag flag-${tone}`}>{children}</span>
);

const isMoneyKey = (k) => {
  const key = String(k).toLowerCase();
  return (
    key.includes("total") ||
    key.includes("diff") ||
    key.includes("difference") ||
    key.includes("amount") ||
    key.includes("sum")
  );
};

const ErrorsDetailsModal = ({ open, row, onClose }) => {
  const hiddenEntries = useMemo(() => {
    if (!row) return [];
    return Object.entries(row).filter(([k, v]) => {
      if (TABLE_KEYS.has(k)) return false; // no repetir lo que ya está en tabla
      if (v === null || v === undefined || v === "") return false;
      return true;
    });
  }, [row]);

  if (!open || !row) return null;

  const diff = Number(row.difference ?? 0);
  const amazonInternalDiff = Number(row.amazonInternalDiff ?? 0);

  const hasDiff = Number(row.flagDiff ?? 0) === 1 || diff !== 0;
  const hasNoSap = Number(row.flagNoSap ?? 0) === 1;
  const hasAmazonInternal =
    Number(row.flagAmazonInternal ?? 0) === 1 || amazonInternalDiff !== 0;

  return (
    <Modal
      title={`Error Details — Settlement ${row.settlementId ?? ""}`}
      onClose={onClose}
    >
      {/* Quick flags */}
      <div className="flags-row" style={{ marginBottom: 14 }}>
        {hasAmazonInternal ? (
          <Flag tone="danger">Amazon internal mismatch</Flag>
        ) : (
          <Flag tone="success">Amazon internal OK</Flag>
        )}

        {hasNoSap ? (
          <Flag tone="danger">No SAP payment</Flag>
        ) : (
          <Flag tone="neutral">SAP payment present</Flag>
        )}

        {hasDiff ? (
          <Flag tone="warning">Amazon vs SAP diff</Flag>
        ) : (
          <Flag tone="success">Amazon vs SAP match</Flag>
        )}
      </div>

      {/* Main details (los 2 que pediste, plus algunos útiles) */}
      <div className="details-grid" style={{ marginBottom: 14 }}>
        <div className="detail-item">
          <span>Deposit Date (UTC)</span>
          <span>{row.depositDate ?? "-"}</span>
        </div>

        <div className="detail-item number">
          <span>SAP Payments Count</span>
          <span>{row.sapPaymentsCount ?? 0}</span>
        </div>

        <div className="detail-item number">
          <span>Amazon Internal Diff</span>
          <span style={{ color: amazonInternalDiff < 0 ? "#b91c1c" : undefined }}>
            {money(amazonInternalDiff)}
          </span>
        </div>

        <div className="detail-item number">
          <span>Amazon Sum Lines</span>
          <span style={{ color: Number(row.amazonSumLines ?? 0) < 0 ? "#b91c1c" : undefined }}>
            {money(row.amazonSumLines)}
          </span>
        </div>

        <div className="detail-item">
          <span>Period</span>
          <span>
            {row.settlementStart ? row.settlementStart.split(" ")[0] : "-"} →{" "}
            {row.settlementEnd ? row.settlementEnd.split(" ")[0] : "-"}
          </span>
        </div>
      </div>

      {/* Extra fields (future-proof) */}
      {hiddenEntries.length > 0 ? (
        <>
          <h4 style={{ margin: "10px 0", fontSize: 14, color: "#374151" }}>
            Other fields
          </h4>

          <div className="details-grid">
            {hiddenEntries.map(([k, v]) => {
              const asNumber = Number(v);
              const isNum = Number.isFinite(asNumber);
              const moneyLike = isMoneyKey(k);

              return (
                <div key={k} className={`detail-item ${isNum ? "number" : ""}`}>
                  <span>{prettyKey(k)}</span>
                  <span
                    style={{
                      color: isNum && asNumber < 0 ? "#b91c1c" : undefined,
                      fontVariantNumeric: isNum ? "tabular-nums" : undefined,
                    }}
                  >
                    {moneyLike && isNum ? money(asNumber) : String(v)}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </Modal>
  );
};

export default ErrorsDetailsModal;

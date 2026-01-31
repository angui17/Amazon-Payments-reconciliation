import React, { useEffect } from "react";
import "../../styles/modal.css"; // donde tengas ese css

const money = (n) => {
  const num = Number(n ?? 0);
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const isNonZero = (v) => Number(v ?? 0) !== 0;

const Flag = ({ tone = "neutral", children }) => (
  <span className={`flag flag-${tone}`}>{children}</span>
);

const SettlementDetailsModal = ({ open, row, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !row) return null;

  const amazonInternalMismatch = isNonZero(row.amazonInternalDiff);
  const noSapPayments =
    Number(row.sapPaymentsCount ?? 0) === 0 && Number(row.amazonTotalReported ?? 0) !== 0;
  const diffAmazonVsSap = isNonZero(row.difference);

  return (
    <div className="modal" onMouseDown={onClose}>
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Settlement Details</h3>
          <button onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal-body">
          {/* Top summary */}
          <div className="details-grid" style={{ marginBottom: 14 }}>
            <div className="detail-item">
              <span>Settlement ID</span>
              <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
                {row.settlementId ?? "-"}
              </span>
            </div>

            <div className="detail-item">
              <span>Status</span>
              <span>{row.status === "P" ? "Pending" : row.status === "C" ? "Completed" : (row.status ?? "-")}</span>
            </div>

            <div className="detail-item">
              <span>Deposit Date (UTC)</span>
              <span>{row.depositDate ?? "-"}</span>
            </div>

            <div className="detail-item number">
              <span>Amazon Total Reported</span>
              <span>{money(row.amazonTotalReported)}</span>
            </div>

            <div className="detail-item number">
              <span>SAP Payments Total</span>
              <span>{money(row.sapPaymentsTotal)}</span>
            </div>

            <div className="detail-item number">
              <span>Difference (Amazon - SAP)</span>
              <span style={{ color: Number(row.difference) < 0 ? "#b91c1c" : undefined }}>
                {money(row.difference)}
              </span>
            </div>
          </div>

          {/* Hidden fields */}
          <h4 style={{ margin: "10px 0 10px", fontSize: 14, color: "#374151" }}>
            More details
          </h4>

          <div className="details-grid" style={{ marginBottom: 14 }}>
            <div className="detail-item number">
              <span>Amazon Sum Lines</span>
              <span>{money(row.amazonSumLines)}</span>
            </div>

            <div className="detail-item number">
              <span>Amazon Internal Diff</span>
              <span style={{ color: amazonInternalMismatch ? "#b91c1c" : undefined }}>
                {money(row.amazonInternalDiff)}
              </span>
            </div>

            <div className="detail-item number">
              <span>SAP Payments Count</span>
              <span>{row.sapPaymentsCount ?? 0}</span>
            </div>

            <div className="detail-item number">
              <span>Exceptions Count</span>
              <span>{row.exceptionsCount ?? 0}</span>
            </div>
          </div>

          {/* Quick flags */}
          <h4 style={{ margin: "10px 0 10px", fontSize: 14, color: "#374151" }}>
            Quick flags
          </h4>

          <div className="flags-row">
            {amazonInternalMismatch ? (
              <Flag tone="danger">Amazon internal mismatch</Flag>
            ) : (
              <Flag tone="success">Amazon internally OK</Flag>
            )}

            {noSapPayments ? (
              <Flag tone="danger">No SAP payments (but Amazon total ≠ 0)</Flag>
            ) : (
              <Flag tone="neutral">SAP payments present</Flag>
            )}

            {diffAmazonVsSap ? (
              <Flag tone="warning">Amazon vs SAP diff ≠ 0</Flag>
            ) : (
              <Flag tone="success">Amazon vs SAP match</Flag>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementDetailsModal;

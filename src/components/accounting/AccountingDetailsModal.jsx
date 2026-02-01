import React, { useMemo } from "react";
import Modal from "../common/Modal";
import "../../styles/modal.css";
import { safeNum } from "../../utils/numberUtils";

const prettyKey = (k) =>
  String(k)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());

const isHiddenKey = (k) => {
  // evitamos duplicar lo que ya está en la tabla 
  const hidden = new Set([
    "settlementId",
    "depositDateDate",
    "status",
    "amazonTotalReported",
    "sapPaymentsTotal",
    "diffPayments",
    "sapJournalEntriesCount",
    "sapJournalTotalDebit",
    "sapJournalTotalCredit",
    "journalBalanced",
    "missingJournal",
    "missingPayments",
  ]);
  return hidden.has(k);
};

const flagPillClass = (type) => {
  if (type === "danger") return "flag flag-danger";
  if (type === "warning") return "flag flag-warning";
  if (type === "success") return "flag flag-success";
  return "flag flag-neutral";
};

const AccountingDetailsModal = ({ open, row, onClose }) => {
  if (!open || !row) return null;

  const flags = useMemo(() => {
    const list = [];

    if (safeNum(row.missingJournal) === 1) {
      list.push({ label: "Missing Journal", type: "warning" });
    } else {
      list.push({ label: "Journal present", type: "success" });
    }

    if (safeNum(row.missingPayments) === 1) {
      list.push({ label: "Missing Payments", type: "danger" });
    } else {
      list.push({ label: "Payments present", type: "success" });
    }

    if (safeNum(row.journalBalanced) === 1) {
      list.push({ label: "Journal balanced", type: "success" });
    } else {
      list.push({ label: "Journal NOT balanced", type: "danger" });
    }

    return list;
  }, [row]);

  return (
    <Modal title={`Settlement ${row.settlementId}`} onClose={onClose}>
      {/* Details */}
      <div className="details-grid" style={{ marginBottom: 14 }}>
        <div className="detail-item">
          <span>Deposit Date (UTC)</span>
          <span>{row.depositDate || "—"}</span>
        </div>

        <div className="detail-item">
          <span>Settlement Start (UTC)</span>
          <span>{row.settlementStart || "—"}</span>
        </div>

        <div className="detail-item">
          <span>Settlement End (UTC)</span>
          <span>{row.settlementEnd || "—"}</span>
        </div>
      </div>

      {/* Panel flags */}
      <div style={{ marginBottom: 14 }}>
        <div className="detail-item" style={{ background: "transparent", padding: 0 }}>
          {/* <span style={{ marginBottom: 7 }}>Flags</span> */}
          <div className="flags-row">
            {flags.map((f) => (
              <span key={f.label} className={flagPillClass(f.type)}>
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* “cualquier otro campo que venga” (extra) */}
      <div className="details-grid">
        {Object.entries(row)
          .filter(([k]) => !isHiddenKey(k))
          .map(([k, v]) => (
            <div key={k} className="detail-item">
              <span>{prettyKey(k)}</span>
              <span>{v === null || v === undefined || v === "" ? "—" : String(v)}</span>
            </div>
          ))}
      </div>
    </Modal>
  );
};

export default AccountingDetailsModal;

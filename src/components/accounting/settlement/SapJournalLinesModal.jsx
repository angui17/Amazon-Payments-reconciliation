import React, { useMemo } from "react";
import Modal from "../../common/Modal";
import "../../../styles/modal.css"; 
import { money } from "../../../utils/settlementsTableUtils";

const SapJournalLinesModal = ({ transId, lines = [], onClose }) => {
  if (transId == null) return null;

  const rows = useMemo(() => {
    const arr = Array.isArray(lines) ? lines : [];
    const tid = Number(transId);
    return arr
      .filter((l) => Number(l?.transId) === tid)
      .sort((a, b) => Number(a?.lineId ?? 0) - Number(b?.lineId ?? 0));
  }, [lines, transId]);

  return (
    <Modal title={`Journal Lines — transId ${transId}`} onClose={onClose}>
      {/* mini resumen arriba */}
      <div className="detail-item" style={{ marginBottom: 14 }}>
        <span>Total lines</span>
        <span>{rows.length}</span>
      </div>

      {/* Cards */}
      <div className="details-grid">
        {rows.length ? (
          rows.map((l, idx) => {
            const key = `${transId}-${l?.lineId ?? idx}-${idx}`;
            const debit = Number(l?.debit ?? 0);
            const credit = Number(l?.credit ?? 0);

            return (
              <div key={key} className="detail-item" style={{ alignItems: "stretch" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontWeight: 700 }}>Line #{l?.lineId ?? "—"}</span>
                  <span className="muted">{l?.refDate ? String(l.refDate).split(" ")[0] : ""}</span>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div className="detail-item" style={{ background: "transparent", padding: 0 }}>
                    <span>Account</span>
                    <span className="mono">{l?.account ?? "—"}</span>
                  </div>

                  <div className="detail-item" style={{ background: "transparent", padding: 0 }}>
                    <span>Short Name</span>
                    <span className="mono">{l?.shortName ?? "—"}</span>
                  </div>

                  <div className="detail-item" style={{ background: "transparent", padding: 0 }}>
                    <span>Debit</span>
                    <span className={debit > 0 ? "diff-ok" : "muted"}>{money(debit)}</span>
                  </div>

                  <div className="detail-item" style={{ background: "transparent", padding: 0 }}>
                    <span>Credit</span>
                    <span className={credit > 0 ? "diff-warn" : "muted"}>{money(credit)}</span>
                  </div>

                  <div className="detail-item" style={{ background: "transparent", padding: 0 }}>
                    <span>Memo</span>
                    <span>{l?.lineMemo ?? "—"}</span>
                  </div>

                  <div className="detail-item" style={{ background: "transparent", padding: 0 }}>
                    <span>Contra Act</span>
                    <span className="mono">{l?.contraAct ?? "—"}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-row">No lines found for this transId.</div>
        )}
      </div>
    </Modal>
  );
};

export default SapJournalLinesModal;

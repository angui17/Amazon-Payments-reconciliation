import React, { useMemo, useState } from "react";
import { money, onlyYMD } from "../../../utils/settlementsTableUtils";
import SapJournalLinesModal from "./SapJournalLinesModal";
import "../../../styles/settlements-table.css";

const isBalanced = (v) => Number(v ?? 0) === 1;

const SapJournalEntriesTable = ({ journals = [], lines = [] }) => {
  const rows = useMemo(
    () => (Array.isArray(journals) ? journals : []),
    [journals]
  );

  const [openTransId, setOpenTransId] = useState(null);

  if (!rows.length) {
    return (
      <div className="table-card" style={{ marginTop: 14 }}>
        <div className="table-header" style={{ padding: 14 }}>
          <h3>Journal Entries</h3>
          <div className="table-meta">0 rows</div>
        </div>
        <div className="empty-row">No journal entries found.</div>
      </div>
    );
  }

  return (
    <>
      <div className="table-card" style={{ marginTop: 14 }}>
        <div className="table-header" style={{ padding: 14 }}>
          <h3>Journal Entries</h3>
          <div className="table-meta">{rows.length} results</div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trans Id</th>
                <th>Date</th>
                <th>Memo</th>
                <th className="th-right">Total debit</th>
                <th className="th-right">Total Credit</th>
                <th className="th-center">Balanced</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((j, idx) => {
                const key = `${j?.transId ?? "trans"}-${idx}`;
                const balanced = isBalanced(j?.balanced);
                const transId = j?.transId;

                return (
                  <tr key={key}>
                    <td>
                      <button
                        type="button"
                        className="link-like"
                        onClick={() => setOpenTransId(transId)}
                        title="View journal lines"
                      >
                        {transId ?? "-"}
                      </button>
                    </td>

                    <td>{onlyYMD(j?.refDate) ?? "-"}</td>
                    <td>{j?.memo ?? "-"}</td>
                    <td className="th-right">{money(j?.totalDebit ?? 0)}</td>
                    <td className="th-right">{money(j?.totalCredit ?? 0)}</td>

                    <td className="th-center">
                      <span
                        className={`status-pill ${
                          balanced ? "status-success" : "status-danger"
                        }`}
                      >
                        {balanced ? "Balanced" : "Unbalanced"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {openTransId != null && (
        <SapJournalLinesModal
          transId={openTransId}
          lines={lines}
          onClose={() => setOpenTransId(null)}
        />
      )}
    </>
  );
};

export default SapJournalEntriesTable;
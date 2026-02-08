import React from "react";
import { Link } from "react-router-dom";

import ErrorsTableHeaders from "./ErrorsTableHeaders";
import "../../styles/settlements-table.css"

const money = (n) => {
  const num = Number(n ?? 0);
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const StatusPill = ({ status }) => {
  const s = String(status || "-").toUpperCase();
  const label = s === "P" ? "Pending" : s === "C" ? "Completed" : s;
  const cls = s === "C" ? "status-success" : s === "P" ? "status-warning" : "status-neutral";
  return <span className={`status-pill ${cls}`}>{label}</span>;
};

const FlagBadge = ({ tone = "neutral", children }) => (
  <span className={`flag-badge flag-${tone}`}>{children}</span>
);

const ErrorsTable = ({ rows = [], onDetails, onExportPdf }) => {
  return (
    <div className="card table-card">
      <div className="card-header table-header">
        <h3>Error Log</h3>
        <div style={{ display: "flex" }}>
          <div className="table-meta" style={{ margin: "10px" }}> {rows.length} rows</div>


          {onExportPdf ? (
            <button
              className="btn btn-sm btn-outline"
              onClick={() => onExportPdf?.()}
              disabled={rows.length === 0}
              type="button"
              title={rows.length === 0 ? "No rows to export" : "Export current view to PDF"}
            >
              Export PDF
            </button>
          ) : null}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <ErrorsTableHeaders />

          <tbody>
            {rows.map((r, idx) => {
              const diff = Number(r.difference ?? 0);
              const amazon = Number(r.amazonTotalReported ?? 0);
              const sap = Number(r.sapPaymentsTotal ?? 0);

              const hasDiff = Number(r.flagDiff ?? 0) === 1 || diff !== 0;
              const hasNoSap = Number(r.flagNoSap ?? 0) === 1;
              const hasAmazonInternal = Number(r.flagAmazonInternal ?? 0) === 1 || Number(r.amazonInternalDiff ?? 0) !== 0;

              return (
                <tr key={`${r.settlementId ?? "row"}-${idx}`}>
                  <td className="mono">
                    <Link to={`/errors/settlements/${r.settlementId}`} state={{ row: r }} className="link-settlement">
                      {r.settlementId ?? "-"}
                    </Link>
                  </td>
                  <td>{r.depositDateDate ?? "-"}</td>
                  <td className={`th-center ${amazon < 0 ? "negative" : ""}`}>{money(amazon)}</td>
                  <td className={`th-center ${sap < 0 ? "negative" : ""}`}>{money(sap)}</td>
                  <td className={`th-center ${diff < 0 ? "negative" : ""}`}>{money(diff)}</td>

                  <td>
                    <div className="flags-wrap">
                      {hasDiff ? <FlagBadge tone="warning">Diff</FlagBadge> : <FlagBadge>OK</FlagBadge>}
                      {hasNoSap ? <FlagBadge tone="danger">No SAP</FlagBadge> : null}
                      {hasAmazonInternal ? <FlagBadge tone="danger">Amazon Internal</FlagBadge> : null}
                    </div>
                  </td>
                  <td><StatusPill status={r.status} /></td>
                  <td className="th-center">
                    <button className="btn btn-sm" onClick={() => onDetails?.(r)}>
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-row">
                  No errors found for selected filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ErrorsTable;

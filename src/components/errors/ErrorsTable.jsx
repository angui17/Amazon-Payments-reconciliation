import React from "react";
import { Link } from "react-router-dom";

import ErrorsTableHeaders from "./ErrorsTableHeaders";
import "../../styles/settlements-table.css"

import {
  money,
  mapStatus,
  effectiveStatusFromDiff,
  rowKey,
} from "../../utils/settlementsTableUtils";


const StatusPill = ({ status }) => {
  const { label, className } = mapStatus(status);
  return <span className={`status-pill ${className}`}>{label}</span>;
};

const FlagBadge = ({ tone = "neutral", children }) => (
  <span className={`flag-badge flag-${tone}`}>{children}</span>
);

const ErrorsTable = ({ rows = [], onDetails, onExportPdf }) => {
  return (
    <div className="card table-card">
      <div className="card-header table-header">
        <h3>Error Log</h3>
        <div className="table-header-right">
          <div className="table-meta">
            {`${rows.length} results`}
          </div>
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

              const status = effectiveStatusFromDiff(r.difference);

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
                    <div className="th-center flags-wrap">
                      {hasDiff ? <FlagBadge tone="warning">Diff</FlagBadge> : <FlagBadge>OK</FlagBadge>}
                      {hasNoSap ? <FlagBadge tone="danger">No SAP</FlagBadge> : null}
                      {hasAmazonInternal ? <FlagBadge tone="danger">Amazon Internal</FlagBadge> : null}
                    </div>
                  </td>
                  <td><StatusPill status={status} /></td>
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

import React from "react";

// Table
import RefundsTableHeaders from "../../refunds/RefundsTableHeaders";
import RefundsPaymentsRows from "../../refunds/RefundsPaymentsRows";
import TableSkeletonOrEmpty from "../../refunds/TableSkeletonOrEmpty";

const RefundsPaymentsTable = ({
  title = "Refund Transactions",
  loading = false,
  rows = [],
  totalItems = 0,
  colSpan = 10,
  onDetails,
  onExportPdf,
}) => {
  return (
    <div className="data-table">
      <div className="table-header">
        <h3>{title}</h3>
        <div className="table-header-right">
          <div className="table-meta">
            {loading ? "Loading..." : `${totalItems} results`}
          </div>

          {onExportPdf ? (
            <button
              className="btn btn-sm btn-outline"
              onClick={() => onExportPdf?.()}
              disabled={loading || rows.length === 0}
              type="button"
              title={rows.length === 0 ? "No rows to export" : "Export current page to PDF"}
              style={{ marginLeft: 10 }}
            >
              Export PDF
            </button>
          ) : null}
        </div>
      </div>

      <div className="table-container">
        <table>
          <RefundsTableHeaders type="payments" />
          <tbody>
            <TableSkeletonOrEmpty
              loading={loading}
              dataLength={rows.length}
              colSpan={colSpan}
              emptyMessage="No payments refunds found"
            />

            {!loading && rows.length > 0 && (
              <RefundsPaymentsRows payments={rows} onDetails={onDetails} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundsPaymentsTable;

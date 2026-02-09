import React from "react";

// table
import InpaymentsFeesTableHeaders from "./InpaymentsFeesTableHeaders";
import InpaymentsFeesTable from "./InpaymentsFeesTable";
import InpaymentsFeesTableSkeleton from "./InpaymentsFeesTableSkeleton";

const InpaymentsFeesTableCard = ({
  title = "Inpayments Fees",
  loading = false,
  rows = [],
  totalItems = 0,
  pageSize = 10,
  colSpan = 11,
  onView,
  onExportPdf, 
}) => {
  return (
    <div className="data-table">
      <div className="table-header">
        <h3>{title}</h3>

        <div className="table-header-right">
          <div className="table-meta">
            {loading ? "Loading..." : `${totalItems} results • showing ${rows.length}`}
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
        <table className="table">
          <InpaymentsFeesTableHeaders />

          <tbody>
            <InpaymentsFeesTableSkeleton
              loading={loading}
              dataLength={totalItems}
              colSpan={colSpan}
              rows={pageSize}
              emptyMessage="No fees found"
            />

            {!loading && rows.length > 0 ? (
              <InpaymentsFeesTable rows={rows} onView={onView} />
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InpaymentsFeesTableCard;

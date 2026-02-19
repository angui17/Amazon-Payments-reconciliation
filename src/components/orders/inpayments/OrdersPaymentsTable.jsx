import React from "react";

// tabla
import OrdersTableHeaders from "../OrdersTableHeaders";
import OrdersTableSkeleton from "../OrdersTableSkeleton";
import OrdersTableBodyPayments from "../OrdersTableBodyPayments";

import "../../../styles/settlements-table.css";

const OrdersPaymentsTable = ({
  title = "Inpayments Orders",
  loading = false,
  rows = [],
  totalItems = 0,
  totalAmount = "",
  pageSize = 10,
  onView,
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
              onClick={onExportPdf}
              disabled={loading || rows.length === 0}
              type="button"
              title={rows.length === 0 ? "No rows to export" : "Export current table to PDF"}
            >
              Export PDF
            </button>
          ) : null}

        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <OrdersTableHeaders type="payments" />
          <tbody>
            <OrdersTableSkeleton
              loading={loading}
              dataLength={rows.length}
              colSpan={7}
              rows={pageSize}
              emptyMessage="No payments found"
            />

            {!loading && rows.length > 0 ? (
              <OrdersTableBodyPayments rows={rows} onView={onView} />
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPaymentsTable;

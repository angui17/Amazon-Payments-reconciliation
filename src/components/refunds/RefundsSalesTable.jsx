import React from "react";
import { toNumber, formatMoney } from "../../utils/refundMath";

const STATUS_LABEL = {
  C: "Completed",
  P: "Pending",
};

const statusClass = (status) =>
  status === "C" ? "status-success" : "status-pending";

const RefundsSalesTable = ({
  title = "Refund Transactions",
  rows = [],
  loading = false,
  totalItems = 0,
  pageSize = 10,
  onDetails,
  onExportPdf, 
}) => {
  return (
    <div className="card table-card">
      {/* ===== Header ===== */}
      <div className="table-header" style={{ padding: 14 }}>
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
              title={rows.length === 0 ? "No rows to export" : "Export current table view to PDF"}
            >
              Export PDF
            </button>
          ) : null}
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Settlement ID</th>
              <th>Order ID</th>
              <th>SKU</th>
              <th className="th-center">Qty</th>
              <th className="th-right">Product Sales</th>
              <th className="th-right">Total</th>
              <th>Status</th>
              <th className="th-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* ===== Skeleton ===== */}
            {loading &&
              [...Array(pageSize)].map((_, i) => (
                <tr key={`sk-${i}`} className="sk-row">
                  <td><div className="sk-line" /></td>
                  <td><div className="sk-line" /></td>
                  <td><div className="sk-line" /></td>
                  <td><div className="sk-line" /></td>
                  <td><div className="sk-line" /></td>
                  <td><div className="sk-line" /></td>
                  <td><div className="sk-line" /></td>
                  <td><div className="sk-pill" /></td>
                  <td><div className="sk-line" /></td>
                </tr>
              ))}

            {/* ===== Empty ===== */}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={9} className="empty-row">
                  No refunds match the selected filters
                </td>
              </tr>
            )}

            {/* ===== Rows ===== */}
            {!loading &&
              rows.map((r, idx) => {
                const productSales = toNumber(r.PRODUCT_SALES);
                const total = toNumber(r.TOTAL);

                return (
                  <tr key={`${r.order_id || "row"}-${idx}`}>
                    <td>{r.DATE || "—"}</td>
                    <td>{r.SETTLEMENT_ID || "—"}</td>
                    <td>{r.order_id || "—"}</td>

                    <td>
                      <div>{r.SKU || "—"}</div>
                      {r.DESCRIPTION && (
                        <div className="sku-details">
                          <div className="sku-info">
                            <span className="sku-label">Product:</span>
                            <span className="sku-value">
                              {String(r.DESCRIPTION).toLowerCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="th-center">{r.QUANTITY ?? "—"}</td>

                    <td className={`th-right ${productSales < 0 ? "negative" : ""}`}>
                      {formatMoney(productSales)}
                    </td>

                    <td className={`th-right ${total < 0 ? "negative" : ""}`}>
                      {formatMoney(total)}
                    </td>

                    <td>
                      <span className={`status-badge ${statusClass(r.STATUS)}`}>
                        {STATUS_LABEL[r.STATUS] || r.STATUS || "—"}
                      </span>
                    </td>

                    <td className="th-center">
                      <button
                        type="button"
                        className="btn btn-sm"   
                        onClick={() => onDetails?.(r)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundsSalesTable;

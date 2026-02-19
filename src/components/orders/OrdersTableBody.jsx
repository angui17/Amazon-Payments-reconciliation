import React from "react";
import StatusBadge from "../ui/StatusBadge";
import { formatDescription } from "../../utils/textUtils";
import OrdersTableHeaders from "./OrdersTableHeaders";
import OrdersTableSkeleton from "./OrdersTableSkeleton";

const OrdersTableBody = ({
  rows = [],
  loading = false,
  totalItems = 0,
  pageSize = 10,
  onView,
  onExportPdf,
  title = "Sales Orders",
}) => {
  return (
    <div className="card table-card">

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

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <OrdersTableHeaders type="sales" />

          <tbody>
            {/* Skeleton */}
            <OrdersTableSkeleton
              loading={loading}
              dataLength={rows.length}
              colSpan={12}
              rows={pageSize}
              emptyMessage="No sales orders found"
            />

            {/* Rows */}
            {!loading && rows.length > 0
              ? rows.map((row, idx) => {
                const productSales = Number(row.PRODUCT_SALES);
                const total = Number(row.TOTAL);

                return (
                  <tr key={`${row.ORDER_ID || row.order_id || idx}-${idx}`}>
                    <td className="">{row.ORDER_ID || row.order_id || "-"}</td>
                    <td className="">{row.SKU || row.sku || "-"}</td>

                    <td className="th-right" title={row.DESCRIPTION || row.description || ""}>
                      {formatDescription(row.DESCRIPTION || row.description)}
                    </td>

                    <td className="th-center">{row.QUANTITY ?? row.quantity ?? "-"}</td>
                    <td className="th-center">{formatDescription(row.MARKETPLACE || row.marketplace || "-")}</td>
                    <td className="th-center">{formatDescription(row.FULFILLMENT || row.fulfillment || "-")}</td>

                    <td className="muted">
                      {`${formatDescription(row.ORDER_CITY || row.city || "")}${row.ORDER_STATE || row.state ? `, ${row.ORDER_STATE || row.state}` : ""
                        }` || "-"}
                    </td>

                    <td className={`${productSales < 0 ? "negative " : ""}`}>
                      {Number.isFinite(productSales) ? `$${productSales.toLocaleString()}` : "-"}
                    </td>

                    <td className="muted ">
                      {row.DATE_TIME ? new Date(row.DATE_TIME).toLocaleDateString() : "-"}
                    </td>

                    <td className={`${total < 0 ? "negative " : ""}`}>
                      {Number.isFinite(total) ? `$${total.toLocaleString()}` : "-"}
                    </td>

                    <td>
                      <StatusBadge status={row.STATUS || row.status} />
                    </td>

                    <td className="th-center">
                      <button className="btn btn-sm" onClick={() => onView?.(row)}>
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTableBody;
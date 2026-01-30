import React from "react";
import "../../styles/orders-table-skeleton.css";

const OrdersTableSkeleton = ({
  loading,
  dataLength,
  colSpan = 12,
  rows = 8,
  emptyMessage = "No orders found",
}) => {
  if (loading) {
    return (
      <>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="orders-skeleton-row">
            {Array.from({ length: colSpan }).map((__, j) => (
              <td key={j}>
                <div
                  className={`orders-skeleton ${
                    j === colSpan - 1 ? "skeleton-w-btn" : "skeleton-w-md"
                  }`}
                />
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }

  if (dataLength === 0) {
    return (
      <tr>
        <td colSpan={colSpan} className="orders-empty">
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return null;
};

export default OrdersTableSkeleton;

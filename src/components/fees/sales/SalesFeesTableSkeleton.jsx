import React from "react";

const SalesFeesTableSkeleton = ({
  loading = false,
  dataLength = 0,
  rows = 10,
  colSpan = 11,
  emptyMessage = "No fees found",
}) => {
  if (loading) {
    return (
      <>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            <td colSpan={colSpan} style={{ padding: 0 }}>
              <div
                style={{
                  height: 44,
                  borderRadius: 10,
                  margin: "8px 10px",
                  background: "linear-gradient(90deg, #f3f4f6, #e5e7eb, #f3f4f6)",
                  backgroundSize: "200% 100%",
                  animation: "feesShimmer 1.2s ease-in-out infinite",
                }}
              />
            </td>
          </tr>
        ))}

        <style>
          {`
            @keyframes feesShimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}
        </style>
      </>
    );
  }

  if (!loading && dataLength === 0) {
    return (
      <tr>
        <td colSpan={colSpan} style={{ padding: "16px", color: "#6b7280", fontSize: 13 }}>
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return null;
};

export default SalesFeesTableSkeleton;

import React from "react";

const InpaymentsFeesTableSkeleton = ({
  loading,
  dataLength,
  colSpan = 10,
  rows = 10,
  emptyMessage = "No fees found",
}) => {
  if (loading) {
    return (
      <>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            <td colSpan={colSpan} style={{ padding: "14px 12px" }}>
              <div
                style={{
                  height: 10,
                  width: "100%",
                  borderRadius: 8,
                  background: "#eee",
                }}
              />
            </td>
          </tr>
        ))}
      </>
    );
  }

  if (!loading && dataLength === 0) {
    return (
      <tr>
        <td colSpan={colSpan} style={{ padding: "16px 12px", textAlign: "center" }}>
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return null;
};

export default InpaymentsFeesTableSkeleton;

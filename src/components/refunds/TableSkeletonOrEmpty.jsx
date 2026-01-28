import React from "react";

const TableSkeletonOrEmpty = ({ loading, dataLength, colSpan, emptyMessage = "No data found" }) => {
  if (loading) {
    return (
      <>
        {[...Array(6)].map((_, i) => (
          <tr key={i} className="skeleton-row">
            <td><div className="skeleton checkbox" /></td>
            <td><div className="skeleton small" /></td>
            <td><div className="skeleton medium" /></td>
            <td><div className="skeleton large" /></td>
            <td><div className="skeleton small" /></td>
            <td><div className="skeleton small" /></td>
            <td><div className="skeleton small" /></td>
            <td><div className="skeleton medium" /></td>
            <td><div className="skeleton button" /></td>
          </tr>
        ))}
      </>
    );
  }

  if (dataLength === 0) {
    return (
      <tr>
        <td colSpan={colSpan} className="empty-state">
          {emptyMessage}
        </td>
      </tr>
    );
  }

  return null; // Si no está cargando y hay datos, no renderiza nada
};

export default TableSkeletonOrEmpty;

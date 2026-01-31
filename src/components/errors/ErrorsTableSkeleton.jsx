import React from "react";
import ErrorsTableHeaders from "./ErrorsTableHeaders";

const Sk = ({ w = "70%" }) => <div className="sk-line" style={{ width: w }} />;

const ErrorsTableSkeleton = ({ rows = 6 }) => {
  return (
    <div className="card table-card">
      <div className="card-header table-header">
        <div className="sk-line" style={{ width: 160, height: 18 }} />
        <div className="sk-line" style={{ width: 90, height: 12 }} />
      </div>

      <div className="table-container">
        <table className="data-table">
          <ErrorsTableHeaders />
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="sk-row">
                <td><Sk w="90%" /></td>
                <td><Sk w="55%" /></td>
                <td><Sk w="45%" /></td>
                <td className="th-right"><Sk w="70%" /></td>
                <td className="th-right"><Sk w="70%" /></td>
                <td className="th-right"><Sk w="65%" /></td>
                <td>
                  <div className="flags-wrap">
                    <div className="sk-pill" style={{ width: 52, height: 22, borderRadius: 999 }} />
                    <div className="sk-pill" style={{ width: 62, height: 22, borderRadius: 999 }} />
                    <div className="sk-pill" style={{ width: 110, height: 22, borderRadius: 999 }} />
                  </div>
                </td>
                <td className="th-center">
                  <div className="sk-pill" style={{ width: 86, height: 32, borderRadius: 10 }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ErrorsTableSkeleton;

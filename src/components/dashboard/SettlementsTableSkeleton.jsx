import React from "react";
import "../../styles/settlements-table.css";

const SkeletonCell = ({ w = "70%" }) => (
  <div className="sk-line" style={{ width: w }} />
);

const SettlementsTableSkeleton = ({ rows = 6 }) => {
  return (
    <div className="card table-card">
      <div className="card-header table-header">
        <div className="sk-line" style={{ width: 180, height: 18 }} />
        <div className="sk-line" style={{ width: 90, height: 12 }} />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Settlement ID</th>
              <th>Deposit Date</th>
              <th>Period</th>
              <th>Status</th>
              <th className="th-right">Amazon Total</th>
              <th className="th-right">SAP Total</th>
              <th className="th-right">Diff</th>
              <th>Reconciled</th>
              <th className="th-right">Exceptions</th>
              <th className="th-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="sk-row">
                <td><SkeletonCell w="90%" /></td>
                <td><SkeletonCell w="60%" /></td>
                <td><SkeletonCell w="95%" /></td>
                <td><SkeletonCell w="55%" /></td>
                <td className="th-right"><SkeletonCell w="70%" /></td>
                <td className="th-right"><SkeletonCell w="70%" /></td>
                <td className="th-right"><SkeletonCell w="65%" /></td>
                <td><SkeletonCell w="45%" /></td>
                <td className="th-right"><SkeletonCell w="35%" /></td>
                <td className="th-center">
                  <div className="sk-pill" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettlementsTableSkeleton;

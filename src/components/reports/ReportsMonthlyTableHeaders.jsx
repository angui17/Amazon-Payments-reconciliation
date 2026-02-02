import React from "react";
import "../../styles/settlements-table.css"

const ReportsMonthlyTableHeaders = () => {
  return (
    <thead >
      <tr >
        <th>Month</th>
        <th>Settlements</th>
        <th>Amazon Total</th>
        <th>SAP Total</th>
        <th>Difference</th>
        <th>Reconciled</th>
        <th>Not Reconciled</th>
        <th>Pending</th>
        <th>% Recon</th>
        <th>Details</th>
      </tr>
    </thead>
  );
};

export default ReportsMonthlyTableHeaders;

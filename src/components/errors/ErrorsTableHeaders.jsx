import React from "react";

const ErrorsTableHeaders = () => {
  return (
    <thead>
      <tr>
        <th>Settlement ID</th>
        <th>Deposit Date</th>
        <th className="th-center">Amazon Total</th>
        <th className="th-center">SAP Total</th>
        <th className="th-center">Diff</th>
        <th>Flags</th>
        <th>Status</th>
        <th className="th-center">Action</th>
      </tr>
    </thead>
  );
};

export default ErrorsTableHeaders;

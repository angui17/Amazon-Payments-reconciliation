import React from "react";

const AccountingTableHeaders = () => {
  return (
    <thead>
      <tr>
        <th className="mono">Settlement ID</th>
        <th>Deposit Date</th>

        <th className="th-center">Amazon Total</th>
        <th className="th-center">SAP Payments</th>
        <th className="th-center">Diff Payments</th>

        <th className="th-center">Journal Entries</th>
        <th className="th-center">Debit</th>
        <th className="th-center">Credit</th>

        <th className="th-center">Balanced</th>
        <th className="th-center">Flags</th>
        <th>Status</th>
        <th className="th-center">Views</th>

      </tr>
    </thead>
  );
};

export default AccountingTableHeaders;

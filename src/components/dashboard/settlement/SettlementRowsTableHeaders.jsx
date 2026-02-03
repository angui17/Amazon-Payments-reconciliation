import React from "react";

const COLS = [
  { key: "posted-date", label: "Posted Date" },
  { key: "deposit-date", label: "Deposit Date" },
  { key: "order-id", label: "Order ID", className: "mono" },
  { key: "sku", label: "SKU", className: "mono" },
  { key: "transaction-type", label: "Type" },
  { key: "amount-description", label: "Description" },
  { key: "amount", label: "Amount", thClass: "th-right" },
  { key: "total-amount", label: "Total", thClass: "th-right" },
  { key: "status", label: "Status", thClass: "th-center" },
];

const SettlementRowsTableHeaders = () => {
  return (
    <thead>
      <tr>
        {COLS.map((c) => (
          <th key={c.key} className={c.thClass || ""}>
            {c.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default SettlementRowsTableHeaders;
export { COLS };

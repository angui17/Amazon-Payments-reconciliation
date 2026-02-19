import React from "react";

const COLS = [
  { key: "paymentType", label: "Payment Type", className: "mono" },
  { key: "paymentDocNum", label: "Payment Doc #", className: "mono" },
  { key: "paymentDocDate", label: "Payment Date" },

  { key: "invoiceNumAtCard", label: "Invoice Num At Card", className: "mono" },
  { key: "invoiceDocNum", label: "Invoice Doc #", className: "mono" },

  { key: "invoiceTotal", label: "Invoice Total", thClass: "th-right" },
  { key: "sumApplied", label: "Applied", thClass: "th-right" },

  { key: "cardName", label: "Card Name" },
];

const SapInvoicesTableHeaders = () => {
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

export default SapInvoicesTableHeaders;
export { COLS };

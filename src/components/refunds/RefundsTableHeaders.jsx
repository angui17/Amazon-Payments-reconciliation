import React from "react";

const refundsSalesTableHeaders = [
    { id: "checkbox", label: <input type="checkbox" /> },
    { id: "refundId", label: "Refund ID" },
    { id: "orderId", label: "Order ID" },
    { id: "sku", label: "SKU" },
    { id: "amount", label: "Amount" },
    { id: "reason", label: "Reason" },
    { id: "status", label: "Status" },
    { id: "createdDate", label: "Created Date" },
    { id: "actions", label: "Actions" },
];

const refundsPaymentsTableHeaders = [
    { id: "checkbox", label: <input type="checkbox" /> },
    { id: "order_id", label: "Order ID" },
    { id: "sku", label: "SKU" },
    { id: "amount", label: "Amount" },
    { id: "AMOUNT_DESCRIPTION", label: "Reason" },
    { id: "status", label: "Status" },
    { id: "POSTED_DATE", label: "Created Date" },
    { id: "actions", label: "Actions" },
]

const RefundsTableHeaders = ({ type }) => {
    const columns =
        type === 'payments'
            ? refundsPaymentsTableHeaders
            : refundsSalesTableHeaders

    return (
        <thead>
            <tr>
                {columns.map(col => (
                    <th key={col.id}>{col.label}</th>
                ))}
            </tr>
        </thead>
    );
};

export default RefundsTableHeaders;

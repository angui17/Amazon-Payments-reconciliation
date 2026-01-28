import React from "react";

const refundsTableHeaders = [
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

const RefundsTableHeaders = () => {
    return (
        <thead>
            <tr>
                {refundsTableHeaders.map(header => (
                    <th key={header.id}>{header.label}</th>
                ))}
            </tr>
        </thead>
    );
};

export default RefundsTableHeaders;

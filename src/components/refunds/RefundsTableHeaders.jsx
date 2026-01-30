import React from "react";

const refundsSalesTableHeaders = [
    { id: "createdDate", label: "Date" },
    { id: "settlementId", label: "Settlement ID" },
    { id: "orderId", label: "Order ID" },
    { id: "sku", label: "SKU" },
    { id: "quantity", label: "Quantity" },
    { id: "productSales", label: "Product Sales" },
    { id: "total", label: "Total" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Actions" }
];

const refundsPaymentsTableHeaders = [
    { id: "POSTED_DATE", label: "Created Date" },
    { id: "sku", label: "SKU" },
    { id: "settlementId", label: "Settlement ID" },
    { id: "settlementStartDate", label: "Settlement Start Date" },
    { id: "settlementEndDate", label: "Settlement End Date" },
    { id: "order_id", label: "Order ID" },
    { id: "AMOUNT_DESCRIPTION", label: "Reason" },
    { id: "amount", label: "Amount" },
    { id: "status", label: "Status" },
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

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

/* 
POSTED_DATE_DATE
id (Settlement ID)
settlement-start-date
settlement-end-date
ORDER_ID
AMOUNT_DESCRIPTION
amount
status
sku
*/
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

import React from "react";

const SalesFeesTableHeaders = () => {
  return (
    <thead>
      <tr>
        <th>Date</th>
        <th>SKU</th>
        <th>Order ID</th>
        <th>Settlement ID</th>
        <th>Type</th>
        <th>Description</th>
        <th>Account</th>
        <th>Marketplace</th>
        <th style={{ textAlign: "right" }}>Total</th>
        <th>Status</th>
        <th style={{ textAlign: "right" }}>Actions</th>
      </tr>
    </thead>
  );
};

export default SalesFeesTableHeaders;

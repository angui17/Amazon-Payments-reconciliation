import React from "react";

const SettlementErrorsDetailTableHeaders = () => {
  return (
    <thead>
      <tr>
        <th>Posted date</th>
        <th >Order ID</th>
        <th >SKU</th>
        <th >Order item</th>
        <th style={{textAlign: "left"}}>Type</th>
        <th>Description</th>
        <th className="th-center">Amount</th>
        <th className="th-center">Total</th>
        <th className="th-center">Status</th>
      </tr>
    </thead>
  );
};

export default SettlementErrorsDetailTableHeaders;

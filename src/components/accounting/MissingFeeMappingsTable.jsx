import React from "react";

const MissingFeeMappingsTable = ({ rows }) => {
  const arr = Array.isArray(rows) ? rows : [];
  if (arr.length === 0) return <div>No data</div>;

  const settlementIdOf = (r) => r.settlementId ?? r.SETTLEMENT_ID ?? r.settlement_id ?? r.id ?? "—";
  const depositDateOf = (r) => r.depositDateDate ?? r.DEPOSIT_DATE_DATE ?? r.DEPOSIT_DATE ?? r.deposit_date ?? "—";
  const diffOf = (r) => r.diffPayments ?? r.DIFF_PAYMENTS ?? r.diff_payments ?? r.DIFF ?? "—";
  const statusOf = (r) => r.status ?? r.STATUS ?? "—";

  return (
    <table style={{ width: "100%", background: "white", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Settlement ID</th>
          <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Deposit date</th>
          <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Diff payments</th>
          <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {arr.map((r, i) => (
          <tr key={settlementIdOf(r) + "|" + i}>
            <td style={{ padding: 8 }}>{settlementIdOf(r)}</td>
            <td style={{ padding: 8 }}>{depositDateOf(r)}</td>
            <td style={{ padding: 8 }}>{diffOf(r)}</td>
            <td style={{ padding: 8 }}>{statusOf(r)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default MissingFeeMappingsTable;

import React from "react";
import ChartCard from "../../../common/ChartCard"; 

const SettlementSapPayments = ({ loading, sapPayments, sapPaymentsCount }) => {
  const has = sapPaymentsCount > 0 && Array.isArray(sapPayments) && sapPayments.length > 0;

  return (
    <ChartCard
      title="SAP Payments"
      subtitle="Documents associated to this settlement"
      loading={loading}
      skeletonClass="chart-skeleton-bars"
    >
      {loading ? null : has ? (
        <div style={{ overflow: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                {Object.keys(sapPayments[0] || {}).slice(0, 8).map((k) => (
                  <th key={k}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sapPayments.map((p, idx) => (
                <tr key={p.id || p.DocEntry || idx}>
                  {Object.keys(sapPayments[0] || {}).slice(0, 8).map((k) => (
                    <td key={k}>{String(p[k] ?? "—")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-placeholder" style={{ borderStyle: "solid" }}>
          No SAP payments are associated with this settlement (U_CTS_SettlementID is empty or not registered).
        </div>
      )}
    </ChartCard>
  );
};

export default SettlementSapPayments;

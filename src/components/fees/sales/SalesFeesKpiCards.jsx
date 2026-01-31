import React, { useMemo } from "react";
import KPICard from "../../common/KPICard"; 
import { totalFeesNet, feeTransactionsCount, topFeeTypeByImpact, avgFeePerSettlement } from "../../../utils/feesMath";

const SalesFeesKpiCards = ({ loading = true, fees = [] }) => {
   const totalFees = useMemo(() => totalFeesNet(fees), [fees]);
  const txCount = useMemo(() => feeTransactionsCount(fees), [fees]);
  const topType = useMemo(() => topFeeTypeByImpact(fees), [fees]);
  const avgPerSettlement = useMemo(() => avgFeePerSettlement(fees), [fees]);

  return (
    <div className="kpi-cards" style={{ marginTop: 14 }}>
      <KPICard
        title="Total Fees (net)"
        value={loading ? "—" : totalFees}
        change="Sum of all fee totals"
      />

      <KPICard
        title="Fee transactions"
        value={loading ? "—" : txCount}
        change="Number of fee records"
      />

      <KPICard
        title="Top fee type"
        value={loading ? "—" : topType}
        change="Type with the largest impact"
      />

      <KPICard
        title="Avg per settlement"
        value={loading ? "—" : avgPerSettlement}
        change="Avg absolute fees per settlement"
      />
    </div>
  );
};

export default SalesFeesKpiCards;

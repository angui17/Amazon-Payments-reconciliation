import React, { useMemo } from "react";
import KPICard from "../../common/KPICard";
import { buildRefundsPaymentsKpis } from "../../../utils/kpicards";

const RefundsPaymentsKpiCards = ({ loading = true, refunds = [] }) => {
  const kpis = useMemo(() => buildRefundsPaymentsKpis(refunds), [refunds]);

  return (
    <div className="kpi-cards">
      <KPICard
        title="Net Refund Impact"
        value={loading ? "0" : kpis.netRefundImpact}
        change="Total impact of refunds"
      />
      <KPICard
        title="Principal refunded"
        value={loading ? "0" : kpis.principalRefunded}
        change="Refunded product amount"
      />
      <KPICard
        title="Refund commission"
        value={loading ? "0" : kpis.refundCommission}
        change="Amazon commission refunds"
      />
      <KPICard
        title="Tax refunded"
        value={loading ? "0" : kpis.taxRefunded}
        change="Refunded taxes"
      />
    </div>
  );
};

export default RefundsPaymentsKpiCards;

import React, { useMemo } from "react";

import KPICard from "../common/KPICard";
import { sumBy, toNumber, formatMoney } from "../../utils/refundMath";

const RefundsSalesKpis = ({ loading = true, refunds = [] }) => {
  // KPIs (tabla-driven)
  const refundUnits = useMemo(
    () => sumBy(refunds, (r) => r.QUANTITY),
    [refunds]
  );

  const refundAmount = useMemo(
    () => sumBy(refunds, (r) => Math.abs(toNumber(r.PRODUCT_SALES))),
    [refunds]
  );

  const netRefundTotal = useMemo(
    () => sumBy(refunds, (r) => r.TOTAL),
    [refunds]
  );

  const fees = useMemo(
    () =>
      sumBy(
        refunds,
        (r) => toNumber(r.SELLING_FEES) + toNumber(r.FBA_FEES) + toNumber(r.OTHER)
      ),
    [refunds]
  );

  return (
    <div className="kpi-cards">
      <KPICard
        title="Refund Amount"
        value={loading ? "—" : formatMoney(refundAmount)}
        change="Total refunded (table view)"
      />
      <KPICard
        title="Refund Units"
        value={loading ? "—" : refundUnits}
        change="Items returned (table view)"
      />
      <KPICard
        title="Net Refund Total"
        value={loading ? "—" : formatMoney(netRefundTotal)}
        change="After adjustments (table view)"
      />
      <KPICard
        title="Fees Refunded / Applied"
        value={loading ? "—" : formatMoney(fees)}
        change="Selling + FBA + Other (table view)"
      />
    </div>
  );
};

export default RefundsSalesKpis;
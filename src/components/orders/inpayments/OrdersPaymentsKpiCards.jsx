import React, { useMemo } from "react";
import KPICard from "../../common/KPICard";
import { buildOrdersPaymentsKpis } from "../../../utils/kpicards";

const OrdersPaymentsKpiCards = ({ loading = true, payments = [] }) => {
  const kpis = useMemo(() => buildOrdersPaymentsKpis(payments), [payments]);

  return (
    <div className="kpi-cards">
      <KPICard
        title="Net Paid for Orders"
        value={loading ? "—" : kpis.netPaid}
        change="Total amount paid by Amazon"
      />
      <KPICard
        title="Orders (unique)"
        value={loading ? "—" : kpis.uniqueOrders}
        change="Number of distinct orders"
      />
      <KPICard
        title="Principal"
        value={loading ? "—" : kpis.principal}
        change="Product sales amount"
      />
      <KPICard
        title="Amazon Commission"
        value={loading ? "—" : kpis.amazonCommission}
        change="Amazon selling commissions"
      />
      <KPICard
        title="FBA Fulfillment Fees"
        value={loading ? "—" : kpis.fbaFees}
        change="Fulfillment by Amazon fees"
      />
    </div>
  );
};

export default OrdersPaymentsKpiCards;

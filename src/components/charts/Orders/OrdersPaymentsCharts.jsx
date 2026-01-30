import React, { useMemo } from "react";

import ChartCard from "./ChartCard";

// charts
import PaymentsNetByDayLine from "./PaymentsNetByDayLine";
import PaymentsAmountStackedByDay from "./PaymentsAmountStackedByDay";
import PaymentsParetoByDesc from "./PaymentsParetoByDesc";

// utils 
import {
  buildNetByDay,
  buildStackedByDay,
  buildParetoByDesc,
} from "../../../utils/paymentsCharts"; 

const OrdersPaymentsCharts = ({ loading = true, payments = [] }) => {
  const netRows = useMemo(() => buildNetByDay(payments), [payments]);
  const stacked = useMemo(() => buildStackedByDay(payments, 8), [payments]);
  const pareto = useMemo(() => buildParetoByDesc(payments, 10), [payments]);

  return (
    <div
      className="charts-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 16,
        marginTop: 16,
      }}
    >
      <ChartCard
        title="Net amount per day"
        subtitle="Daily net payments from Amazon"
        loading={loading}
        span={6}
        height={280}
      >
        <PaymentsNetByDayLine rows={netRows} />
      </ChartCard>

      <ChartCard
        title="Amount per day by description"
        subtitle="Daily payments broken down by type"
        loading={loading}
        span={6}
        height={320}
      >
        <PaymentsAmountStackedByDay data={stacked.data} keys={stacked.keys} />
      </ChartCard>

      <ChartCard
        title="Pareto by amount description"
        subtitle="Main payment drivers by impact"
        loading={loading}
        span={12}
        height={320}
      >
        <PaymentsParetoByDesc rows={pareto} />
      </ChartCard>
    </div>
  );
};

export default OrdersPaymentsCharts;

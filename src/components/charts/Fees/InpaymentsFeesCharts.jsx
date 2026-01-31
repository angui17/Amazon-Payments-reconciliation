import React, { useMemo } from "react";
import ChartsGrid from "./ChartsGrid";
import ChartCard from "./ChartCard";

import FeeTypeDoughnut from "./FeeTypeDoughnut";
import TopFeeDescriptionsBar from "./TopFeeDescriptionsBar";
import FeesNetLine from "./FeesNetLine";
import FeesBySettlementBar from "./FeesBySettlementBar";

import {
  feesByTypeAbs,
  topFeeDescriptionsAbs,
  feesNetByDay,
  feesBySettlementNet,
} from "../../../utils/feesCharts";

const InpaymentsFeesCharts = ({ loading = true, fees = [] }) => {
  const byType = useMemo(() => feesByTypeAbs(fees), [fees]);
  const topDesc = useMemo(() => topFeeDescriptionsAbs(fees, 10), [fees]);
  const netDay = useMemo(() => feesNetByDay(fees), [fees]);
  const bySettlement = useMemo(() => feesBySettlementNet(fees, 12), [fees]);

  return (
    <ChartsGrid>
      <ChartCard
        title="Fees by type"
        subtitle="Abs total by TYPE"
        loading={loading}
        span={6}
      >
        <FeeTypeDoughnut labels={byType.labels} values={byType.values} />
      </ChartCard>

      <ChartCard
        title="Top fee descriptions"
        subtitle="Top descriptions by abs total"
        loading={loading}
        span={6}
      >
        <TopFeeDescriptionsBar labels={topDesc.labels} values={topDesc.values} />
      </ChartCard>

      <ChartCard
        title="Fees net over time"
        subtitle="Net total per day"
        loading={loading}
        span={6}
      >
        <FeesNetLine labels={netDay.labels} values={netDay.values} />
      </ChartCard>

      <ChartCard
        title="Fees by settlement"
        subtitle="Net total by settlement"
        loading={loading}
        span={6}
      >
        <FeesBySettlementBar labels={bySettlement.labels} values={bySettlement.values} />
      </ChartCard>
    </ChartsGrid>
  );
};

export default InpaymentsFeesCharts;

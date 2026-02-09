import React, { useMemo, useRef, forwardRef, useImperativeHandle } from "react";
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

const InpaymentsFeesCharts = forwardRef(({ loading = true, fees = [] }, ref) => {
  const doughnutRef = useRef(null);
  const topDescRef = useRef(null);
  const netLineRef = useRef(null);
  const bySettlementRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getChartImages: () => {
      const grab = (r) => r?.current?.toBase64Image?.() || null;
      const images = [];

      const a = grab(doughnutRef);
      if (a) images.push(a);

      const b = grab(topDescRef);
      if (b) images.push(b);

      const c = grab(netLineRef);
      if (c) images.push(c);

      const d = grab(bySettlementRef);
      if (d) images.push(d);

      return images;
    },
  }));

  const byType = useMemo(() => feesByTypeAbs(fees), [fees]);
  const topDesc = useMemo(() => topFeeDescriptionsAbs(fees, 10), [fees]);
  const netDay = useMemo(() => feesNetByDay(fees), [fees]);
  const bySettlement = useMemo(() => feesBySettlementNet(fees, 12), [fees]);

  return (
    <ChartsGrid>
      <ChartCard title="Fees by type" subtitle="Abs total by TYPE" loading={loading} span={6}>
        <FeeTypeDoughnut ref={doughnutRef} labels={byType.labels} values={byType.values} />
      </ChartCard>

      <ChartCard title="Top fee descriptions" subtitle="Top descriptions by abs total" loading={loading} span={6}>
        <TopFeeDescriptionsBar ref={topDescRef} labels={topDesc.labels} values={topDesc.values} />
      </ChartCard>

      <ChartCard title="Fees net over time" subtitle="Net total per day" loading={loading} span={6}>
        <FeesNetLine ref={netLineRef} labels={netDay.labels} values={netDay.values} />
      </ChartCard>

      <ChartCard title="Fees by settlement" subtitle="Net total by settlement" loading={loading} span={6}>
        <FeesBySettlementBar ref={bySettlementRef} labels={bySettlement.labels} values={bySettlement.values} />
      </ChartCard>
    </ChartsGrid>
  );
});

InpaymentsFeesCharts.displayName = "InpaymentsFeesCharts";
export default InpaymentsFeesCharts;

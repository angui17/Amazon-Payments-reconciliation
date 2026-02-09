import React, { useMemo } from "react";
import KPICard from "../../common/KPICard";

import {
  totalInpaymentsNet,
  inpaymentsRowsCount,
  topFeeConceptByAbs,
  reserveMovementNet,
} from "../../../utils/inpaymentsMath";

const InpaymentsFeesKpiCards = ({ loading = true, fees = [] }) => {
  const totalNet = useMemo(() => totalInpaymentsNet(fees), [fees]);
  const rowsCount = useMemo(() => inpaymentsRowsCount(fees), [fees]);
  const topConcept = useMemo(() => topFeeConceptByAbs(fees), [fees]);
  const reserveMove = useMemo(() => reserveMovementNet(fees), [fees]);

  return (
    <div className="kpi-cards" style={{ marginTop: 14 }}>
      <KPICard
        title="Total Fees Net"
        value={loading ? "—" : totalNet}
        change="Net impact of all fee movements"
      />

      <KPICard
        title="Fee Rows"
        value={loading ? "—" : rowsCount}
        change="Total fee transactions"
      />

      <KPICard
        title="Top Fee Concept"
        value={loading ? "—" : topConcept}
        change="Largest impact on total fees"
      />

      <KPICard
        title="Reserve Movement"
        value={loading ? "—" : reserveMove}
        change="Net change in Amazon reserves"
      />
    </div>
  );
};

export default InpaymentsFeesKpiCards;

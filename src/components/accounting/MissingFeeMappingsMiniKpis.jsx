import React, { useMemo } from "react";
import KPICard from "../common/KPICard"; 

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const money = (v) =>
  num(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MissingFeeMappingsMiniKpis = ({ summary, rows = [] }) => {
  const settlementsAffected = useMemo(() => {
    const set = new Set();
    (Array.isArray(rows) ? rows : []).forEach((r) => {
      const id = r?.settlementId;
      if (id) set.add(String(id));
    });
    return set.size;
  }, [rows]);

  const missingCount = num(summary?.count);
  const totalImpact = num(summary?.totalAmount);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 12,
      }}
    >
      <KPICard title="Missing mappings" value={missingCount.toLocaleString()} trend={missingCount > 0 ? "warn" : "success"} />
      <KPICard title="Total impact" value={`$ ${money(totalImpact)}`} trend={totalImpact !== 0 ? "warn" : "success"} />
      <KPICard title="Settlements affected" value={settlementsAffected.toLocaleString()} trend={settlementsAffected > 0 ? "warn" : "success"} />
    </div>
  );
};

export default MissingFeeMappingsMiniKpis;

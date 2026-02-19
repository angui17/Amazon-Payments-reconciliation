import React, { useMemo } from "react";
import KPICard from "../common/KPICard"; 

const ExceptionsEmptyCard = ({ summary, rows }) => {
  const count = useMemo(() => Number(summary?.count ?? 0), [summary]);
  const hasRows = useMemo(() => (Array.isArray(rows) ? rows.length : 0) > 0, [rows]);

  // Solo mostrar este bloque cuando está vacío de verdad
  const isEmpty = count === 0 && !hasRows;
  if (!isEmpty) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <KPICard
          title="Missing mappings"
          value={0}
          change="Missing fee account mappings"
          trend="neutral"
        />

        <KPICard
          title="Impact"
          value={0}
          change="Total impact for missing mappings"
          trend="neutral"
        />
      </div>

    </div>
  );
};

export default ExceptionsEmptyCard;

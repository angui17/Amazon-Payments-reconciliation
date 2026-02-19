import React, { useMemo } from "react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const parseYMD = (s) => {
  if (!s) return null;
  const d = String(s).split(" ")[0];
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return null;
  return new Date(y, m - 1, day);
};

const daysBetween = (fromDate, toDate) => {
  if (!fromDate || !toDate) return null;
  const a = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const b = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  return Math.floor((b - a) / MS_PER_DAY);
};

const money = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const BUCKETS = [
  { key: "0-7", label: "0–7", min: 0, max: 7 },
  { key: "8-15", label: "8–15", min: 8, max: 15 },
  { key: "16-30", label: "16–30", min: 16, max: 30 },
  { key: "30+", label: "30+", min: 31, max: Infinity },
];

const bucketFor = (daysOpen) => {
  for (const b of BUCKETS) {
    if (daysOpen >= b.min && daysOpen <= b.max) return b.key;
    if (b.max === Infinity && daysOpen >= b.min) return b.key;
  }
  return null;
};

const PendingSettlementsAging = ({
  rows = [],
  loading = false,
  amountAccessor = (r) => r?.difference ?? r?.amazonTotalReported ?? 0,
  pendingPredicate = (r) => String(r?.status || "").toUpperCase() === "P",
}) => {
  const { table, totalCount } = useMemo(() => {
    const today = new Date();
    const init = Object.fromEntries(
      BUCKETS.map((b) => [b.key, { label: b.label, count: 0, total: 0 }])
    );

    const arr = Array.isArray(rows) ? rows : [];
    for (const r of arr) {
      if (!pendingPredicate(r)) continue;

      const dep = parseYMD(r?.depositDateDate);
      if (!dep) continue;

      const daysOpen = daysBetween(dep, today);
      if (!Number.isFinite(daysOpen) || daysOpen < 0) continue;

      const key = bucketFor(daysOpen);
      if (!key) continue;

      init[key].count += 1;
      init[key].total += Number(amountAccessor(r) ?? 0) || 0;
    }

    const out = BUCKETS.map((b) => ({
      daysOpen: init[b.key].label,
      count: init[b.key].count,
      total: init[b.key].total,
    }));

    return {
      table: out,
      totalCount: out.reduce((a, x) => a + x.count, 0),
    };
  }, [rows, amountAccessor, pendingPredicate]);

  return (
    <div className="aging-panel">
      <div className="aging-panel__header">
        <div>
          <div className="aging-panel__title">Pending Settlements Aging</div>
          <div className="aging-panel__subtitle">
            Open days buckets (Pending: {totalCount})
          </div>
        </div>
      </div>

      {loading ? (
        <div className="aging-panel__skeleton" />
      ) : (
        <div className="aging-panel__body">
          <table className="aging-table">
            <thead>
              <tr>
                <th>Days Open</th>
                <th className="num">Count</th>
                <th className="num">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {table.map((r) => (
                <tr key={r.daysOpen}>
                  <td>{r.daysOpen}</td>
                  <td className="num">{r.count}</td>
                  <td className="num">{money(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingSettlementsAging;

import React, { useMemo } from "react";
import ChartCard from "../common/ChartCard";
import AccountingByDayLine from "../charts/Accounting/AccountingByDayLine";
import AccountingFlagsBars from "../charts/Accounting/AccountingFlagsBars";

// ---------- helpers ----------
const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const pick = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

const onlyDate = (v) => {
  if (!v) return null;
  const s = String(v);
  // "2025-01-12 17:44:52 UTC" -> "2025-01-12"
  return s.split(" ")[0];
};

const normalizeLabel = (label) => {
  const s = String(label || "");
  // keep as-is for known ones
  if (["missingPayments", "missingJournal", "unbalancedJournal"].includes(s)) return s;
  // try to map common variants
  const low = s.toLowerCase();
  if (low.includes("missing") && low.includes("payment")) return "missingPayments";
  if (low.includes("missing") && low.includes("journal")) return "missingJournal";
  if (low.includes("unbalance") && low.includes("journal")) return "unbalancedJournal";
  return s;
};

// build byDay from rows if possible
const buildByDayFromRows = (rows) => {
  const map = new Map();

  for (const r of rows) {
    const dateRaw = pick(r, [
      "date",
      "DATE",
      "depositDateDate",
      "deposit-date-date",
      "postedDate",
      "posted-date",
      "depositDate",
      "deposit-date",
    ]);

    const date = onlyDate(dateRaw);
    if (!date) continue;

    const amazon = toNum(pick(r, ["amazonTotal", "amazon_total", "AMAZON_TOTAL", "amazonTotalReported", "amazon_total_reported"]));
    const sapPay = toNum(pick(r, ["sapPaymentsTotal", "sap_payments_total", "SAP_PAYMENTS_TOTAL"]));
    const sapDebit = toNum(pick(r, ["sapJournalDebit", "sap_journal_debit", "SAP_JOURNAL_DEBIT"]));
    const diffPay = toNum(pick(r, ["diffPaymentsTotal", "diff_payments_total", "DIFF_PAYMENTS_TOTAL", "difference", "DIFFERENCE"]));

    // Si el row no tiene ninguno de estos números, no aporta al chart A
    if (amazon === 0 && sapPay === 0 && sapDebit === 0 && diffPay === 0) continue;

    const prev = map.get(date) || {
      date,
      amazonTotal: 0,
      sapPaymentsTotal: 0,
      sapJournalDebit: 0,
      diffPaymentsTotal: 0,
    };

    prev.amazonTotal += amazon;
    prev.sapPaymentsTotal += sapPay;
    prev.sapJournalDebit += sapDebit;
    prev.diffPaymentsTotal += diffPay;

    map.set(date, prev);
  }

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
};

// build flags from rows if possible
const buildFlagsFromRows = (rows) => {
  const counts = {
    missingPayments: 0,
    missingJournal: 0,
    unbalancedJournal: 0,
  };

  for (const r of rows) {
    // common patterns: boolean flags, 0/1, or string "Y"
    const mp = pick(r, ["missingPayments", "missing_payments", "MISSING_PAYMENTS"]);
    const mj = pick(r, ["missingJournal", "missing_journal", "MISSING_JOURNAL"]);
    const uj = pick(r, ["unbalancedJournal", "unbalanced_journal", "UNBALANCED_JOURNAL"]);

    const truthy = (v) => {
      if (v === true) return true;
      if (typeof v === "number") return v !== 0;
      if (typeof v === "string") return ["1", "true", "y", "yes"].includes(v.toLowerCase());
      return false;
    };

    if (truthy(mp)) counts.missingPayments += 1;
    if (truthy(mj)) counts.missingJournal += 1;
    if (truthy(uj)) counts.unbalancedJournal += 1;
  }

  // si no encontró nada, devolvemos [] para que use fallback charts.flagsCounts
  const total = counts.missingPayments + counts.missingJournal + counts.unbalancedJournal;
  if (total === 0) return [];

  return [
    { label: "missingPayments", count: counts.missingPayments },
    { label: "missingJournal", count: counts.missingJournal },
    { label: "unbalancedJournal", count: counts.unbalancedJournal },
  ];
};

const AccountingCharts = ({ charts, rows, loading }) => {
  const { byDay, flagsCounts } = useMemo(() => {
    const backendByDay = charts?.byDay || [];
    const backendFlags = (charts?.flagsCounts || []).map((x) => ({
      ...x,
      label: normalizeLabel(x.label),
    }));

    const hasRows = Array.isArray(rows) && rows.length > 0;

    if (!hasRows) {
      return { byDay: backendByDay, flagsCounts: backendFlags };
    }

    // try to build from rows (filtered)
    const rowByDay = buildByDayFromRows(rows);
    const rowFlags = buildFlagsFromRows(rows);

    return {
      byDay: rowByDay.length ? rowByDay : backendByDay,
      flagsCounts: rowFlags.length ? rowFlags : backendFlags,
    };
  }, [charts, rows]);

  if (!loading && !byDay.length && !flagsCounts.length) return null;

  return (
    <div className="charts-grid">
      <ChartCard
        title="Payments & Journal by day"
        subtitle="Amazon vs SAP + diffs"
        loading={loading}
        skeletonClass="chart-skeleton-line"
      >
        <AccountingByDayLine data={byDay} />
      </ChartCard>

      <ChartCard
        title="Flags"
        subtitle="Missing / unbalanced indicators"
        loading={loading}
        skeletonClass="chart-skeleton-bars"
      >
        <AccountingFlagsBars data={flagsCounts} />
      </ChartCard>
    </div>
  );
};

export default AccountingCharts;
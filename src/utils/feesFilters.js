import { parseDateUTC } from "./dateUtils";

const normalize = (v) => String(v ?? "").trim().toLowerCase();

export const lastNDaysRange = (n, anchorYMD) => {
  const days = Number(n || 30);

  // anchorYMD: "YYYY-MM-DD"
  const end = anchorYMD ? new Date(`${anchorYMD}T00:00:00`) : new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));

  const pad = (x) => String(x).padStart(2, "0");
  const toYMD = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return { from: toYMD(start), to: toYMD(end) };
};

// fee.DATE viene "MM-DD-YYYY"
const feeDateToTs = (fee) => parseDateUTC(fee?.DATE, false);

export const filterFees = (fees = [], filters = {}) => {
  const settlementQ = normalize(filters.settlementId);
  const descQ = normalize(filters.description);
  const status = filters.status || "";
  const types = new Set(filters.types || []);

  // rango final a aplicar
  const rangeFrom = filters.from || "";
  const rangeTo = filters.to || "";
  const fromTs = rangeFrom ? parseDateUTC(rangeFrom, false) : null; // YYYY-MM-DD
  const toTs = rangeTo ? parseDateUTC(rangeTo, true) : null;

  return (fees || []).filter((f) => {
    // 1) date range (si hay)
    if (fromTs || toTs) {
      const ts = feeDateToTs(f);
      if (!ts) return false;
      if (fromTs && ts < fromTs) return false;
      if (toTs && ts > toTs) return false;
    }

    // 2) settlement id contains
    if (settlementQ) {
      const s = normalize(f.SETTLEMENT_ID || f.settlement_id);
      if (!s.includes(settlementQ)) return false;
    }

    // 3) type multi
    if (types.size > 0) {
      const t = String(f.TYPE || "").trim();
      if (!types.has(t)) return false;
    }

    // 4) description contains
    if (descQ) {
      const d = normalize(f.DESCRIPTION);
      if (!d.includes(descQ)) return false;
    }

    // 5) status
    if (status) {
      const st = String(f.STATUS ?? f.status ?? "").trim();
      if (st !== status) return false;
    }

    return true;
  });
};

import { dateToTs, dateToTsEnd } from "./dateUtils";

const norm = (v) => String(v ?? "").trim().toLowerCase();

// "YYYY-MM-DD" desde POSTED_DATE_DATE / POSTED_DATE (a veces viene con hora)
const postedDayYMD = (r) =>
  String(
    r?.POSTED_DATE_DATE ??
      r?.POSTED_DATE ??
      r?.["POSTED_DATE_DATE"] ??
      r?.["POSTED_DATE"] ??
      ""
  ).slice(0, 10);

export const getRefundsPaymentsOptions = (rows = []) => {
  const statusSet = new Set();
  const reasonSet = new Set();

  (rows || []).forEach((r) => {
    const st = String(r?.STATUS ?? r?.status ?? "").trim();
    if (st) statusSet.add(st);

    const reason = String(r?.AMOUNT_DESCRIPTION ?? r?.description ?? "").trim();
    if (reason) reasonSet.add(reason);
  });

  return {
    statuses: Array.from(statusSet).filter(Boolean).sort(),
    reasons: Array.from(reasonSet).filter(Boolean).sort(),
  };
};

export const filterRefundsPayments = (rows = [], filters = {}) => {
  // ✅ nuevo shape (draft/applied)
  // - settlement: string
  // - reason: string (select simple)
  //
  // ✅ compat: settlementId / reasons[] viejos
  const {
    from = "",
    to = "",

    settlement = "", // NEW
    settlementId = "", // OLD compat

    orderId = "",
    sku = "",

    status = "",

    reason = "", // NEW (single)
    reasons = [], // OLD (multi)

    search = "",
  } = filters;

  // rango
  const fromTs = from ? dateToTs(from) : null;
  const toTs = to ? dateToTsEnd(to) : null;

  // queries
  const qSettlement = norm(settlement || settlementId);
  const qOrder = norm(orderId);
  const qSku = norm(sku);

  const statusQ = String(status || "").trim();

  // ✅ si viene reason (string), lo usamos
  // ✅ si vienen reasons (array), lo usamos (compat)
  const reasonQ = String(reason || "").trim();
  const reasonsSet = new Set((Array.isArray(reasons) ? reasons : []).filter(Boolean));

  const q = norm(search);

  return (rows || []).filter((r) => {
    const posted = postedDayYMD(r);
    const ts = posted ? dateToTs(posted) : null;

    // 1) date range
    if (fromTs || toTs) {
      if (ts === null) return false;
      if (fromTs && ts < fromTs) return false;
      if (toTs && ts > toTs) return false;
    }

    // fields
    const rowSettlement = norm(
      r?.SETTLEMENT_ID ?? r?.settlementId ?? r?.settlement_id ?? r?.id ?? ""
    );
    const rowOrder = norm(r?.ORDER_ID ?? r?.order_id ?? "");
    const rowSku = norm(r?.SKU ?? r?.sku ?? "");
    const rowStatus = String(r?.STATUS ?? r?.status ?? "").trim();
    const rowReason = String(r?.AMOUNT_DESCRIPTION ?? r?.description ?? "Other").trim();

    // 2) settlement contains
    if (qSettlement && !rowSettlement.includes(qSettlement)) return false;

    // 3) order contains
    if (qOrder && !rowOrder.includes(qOrder)) return false;

    // 4) sku contains
    if (qSku && !rowSku.includes(qSku)) return false;

    // 5) status exact
    if (statusQ && rowStatus !== statusQ) return false;

    // 6) reason filter
    // NEW: single exact
    if (reasonQ && rowReason !== reasonQ) return false;

    // OLD compat: multi exact
    if (!reasonQ && reasonsSet.size > 0 && !reasonsSet.has(rowReason)) return false;

    // 7) search global (opcional)
    if (!q) return true;

    return (
      rowSettlement.includes(q) ||
      rowOrder.includes(q) ||
      rowSku.includes(q) ||
      norm(rowReason).includes(q) ||
      norm(rowStatus).includes(q)
    );
  });
};

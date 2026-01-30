import React, { useMemo } from "react";
import Modal from "../common/Modal";
import "../../styles/modal.css";

const TABLE_KEYS = new Set([
  "ORDER_ID",
  "SKU",
  "AMOUNT_DESCRIPTION",
  "AMOUNT",
  "STATUS",
  "TOTAL_AMOUNT",
  "TOTAL-AMOUNT",
  "ACTIONS",
]);

const normalizeKey = (k) => String(k).toUpperCase();

const prettyKey = (k) =>
  String(k)
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());

const isEmpty = (v) => v === null || v === undefined || v === "";

const toNumberSafe = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const cleaned = String(v).replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

const isMoneyKey = (k) => {
  const key = normalizeKey(k);
  return (
    key.includes("AMOUNT") ||
    key.includes("TOTAL") ||
    key.includes("FEE") ||
    key.includes("FEES") ||
    key.includes("TAX") ||
    key.includes("COMMISSION")
  );
};

const formatMoney = (v) => {
  const n = toNumberSafe(v);
  if (n === null) return String(v ?? "—");

  const abs = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // contable: -$10.65 en vez de $-10.65
  return n < 0 ? `-$${abs}` : `$${abs}`;
};

const PaymentsDetailsModal = ({ payment, onClose }) => {
  const extraFields = useMemo(() => {
    if (!payment) return [];

    // 1) Dedup: si viene ORDER_ID y order_id, nos quedamos con el “mejor”
    const map = new Map(); // normalizedKey -> { key, value }
    for (const [key, value] of Object.entries(payment)) {
      const nk = normalizeKey(key);
      const existing = map.get(nk);

      if (!existing) {
        map.set(nk, { key, value });
        continue;
      }

      // preferimos el que tenga valor
      if (isEmpty(existing.value) && !isEmpty(value)) {
        map.set(nk, { key, value });
        continue;
      }

      // si ambos tienen valor, preferimos key en MAYÚSCULA (más “backend vibes”)
      if (String(key) === nk && String(existing.key) !== nk) {
        map.set(nk, { key, value });
      }
    }

    // 2) Filtramos los que ya están en tabla
    const entries = Array.from(map.values()).filter(({ key }) => {
      const nk = normalizeKey(key);
      return !TABLE_KEYS.has(nk);
    });

    // 3) Orden lindo
    const priority = (k) => {
      const nk = normalizeKey(k);
      if (nk.includes("SETTLEMENT")) return 1;
      if (nk.includes("POSTED_DATE")) return 2;
      if (nk === "TYPE") return 3;
      if (nk.includes("DEPOSIT")) return 4;
      if (nk.includes("ID")) return 5;
      if (nk.includes("AMOUNT") || nk.includes("TOTAL")) return 10;
      return 50;
    };

    return entries.sort(
      (a, b) => priority(a.key) - priority(b.key) || a.key.localeCompare(b.key)
    );
  }, [payment]);

  if (!payment) return null;

  const title =
    payment.ORDER_ID || payment.order_id
      ? `Payment details • ${payment.ORDER_ID || payment.order_id}`
      : "Payment details";

  return (
    <Modal title={title} onClose={onClose}>
      <div className="details-grid">
        {extraFields.map(({ key, value }) => {
          const nk = normalizeKey(key);

          const display = isEmpty(value)
            ? "—"
            : isMoneyKey(nk)
            ? formatMoney(value)
            : String(value);

          const isNumber = isMoneyKey(nk);
          const negative = isNumber && (toNumberSafe(value) ?? 0) < 0;

          return (
            <div
              key={nk}
              className={`detail-item ${isNumber ? "number" : ""}`}
              style={
                negative
                  ? { border: "1px solid rgba(220,38,38,.35)", background: "rgba(220,38,38,.06)" }
                  : undefined
              }
            >
              <span>{prettyKey(nk)}</span>
              <span style={negative ? { color: "#dc2626", fontWeight: 600 } : undefined}>
                {display}
              </span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default PaymentsDetailsModal;

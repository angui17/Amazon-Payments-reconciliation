import React, { useMemo } from "react";
import Modal from "../../common/Modal"; 
import "../../../styles/modal.css"; 

const TABLE_KEYS = new Set([
  "DATE",
  "SKU",
  "ORDER_ID",
  "SETTLEMENT_ID",
  "TYPE",
  "DESCRIPTION",
  "ACCOUNT_TYPE",
  "MARKETPLACE",
  "TOTAL",
  "STATUS",
]);

const normalizeKey = (k) => String(k || "").toUpperCase();

const prettyKey = (k) =>
  String(k)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());

// money-ish fields
const isMoneyKey = (k) => {
  const key = normalizeKey(k);
  return (
    key.includes("SALES") ||
    key.includes("FEES") ||
    key.includes("TAX") ||
    key.includes("CREDITS") ||
    key.includes("REBATES") ||
    key.includes("TOTAL") ||
    key.includes("AMOUNT") ||
    key.includes("FEE") ||
    key.includes("WITHHELD")
  );
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const formatMoney = (v) => {
  const n = toNumber(v);
  if (n === null) return String(v ?? "—");
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const isEmpty = (v) => v === null || v === undefined || v === "";

// Para que el modal sea “smart”: priorizamos algunos campos arriba
const priority = (k) => {
  const key = normalizeKey(k);

  if (key === "DATE_TIME") return 1;
  if (key === "ID_UNIQUE") return 2;
  if (key.includes("FULFILLMENT")) return 3;

  if (key.includes("ORDER_CITY") || key.includes("ORDER_STATE") || key.includes("ORDER_POSTAL"))
    return 6;

  if (key.includes("TAX_COLLECTION_MODEL")) return 10;

  if (key.includes("TAX")) return 20;
  if (key.includes("FEES") || key.includes("FEE")) return 21;

  return 50;
};

const SalesFeeDetailsModal = ({ fee, onClose }) => {
  const extraFields = useMemo(() => {
    if (!fee) return [];

    // 1) Dedupe (TOTAL vs total, STATUS vs status, etc.)
    const map = new Map(); // normalizedKey -> { key, value }
    for (const [key, value] of Object.entries(fee)) {
      const nk = normalizeKey(key);
      const existing = map.get(nk);

      if (!existing) {
        map.set(nk, { key, value });
      } else {
        // preferimos el valor más “útil”
        if (isEmpty(existing.value) && !isEmpty(value)) map.set(nk, { key, value });
        // si ambos tienen valor, preferimos la key MAYÚSCULA (se ve más “oficial”)
        else if (String(key) === nk && String(existing.key) !== nk) map.set(nk, { key, value });
      }
    }

    // 2) Sacamos lo que ya está en la tabla
    const entries = Array.from(map.values()).filter(({ key }) => !TABLE_KEYS.has(normalizeKey(key)));

    // 3) Sacamos campos “basura” o redundantes si querés (opcionales)
    // Ej: date_time / order_id / sku ya normalizados por tu normalizeItem
    const blacklist = new Set(["ORDER_ID", "SKU", "STATUS", "TOTAL", "DATE"]); // por las dudas
    const cleaned = entries.filter(({ key }) => !blacklist.has(normalizeKey(key)));

    // 4) Orden lindo
    return cleaned.sort(
      (a, b) => priority(a.key) - priority(b.key) || a.key.localeCompare(b.key)
    );
  }, [fee]);

  if (!fee) return null;

  // Header summary (muestra “lo clave” arriba, sin repetir toda la tabla)
  const headerLine = `${fee.TYPE || "Fee"} • ${fee.DESCRIPTION || "—"}`;

  return (
    <Modal title="Fee details" onClose={onClose}>
      <div style={{ marginBottom: 10, color: "#6b7280", fontSize: 13 }}>
        {headerLine}
      </div>

      <div className="details-grid">
        {extraFields.map(({ key, value }) => {
          const k = normalizeKey(key);

          const display = isEmpty(value)
            ? "—"
            : isMoneyKey(k)
              ? formatMoney(value)
              : String(value);

          return (
            <div key={k} className={`detail-item ${isMoneyKey(k) ? "number" : ""}`}>
              <span>{prettyKey(k)}</span>
              <span>{display}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default SalesFeeDetailsModal;

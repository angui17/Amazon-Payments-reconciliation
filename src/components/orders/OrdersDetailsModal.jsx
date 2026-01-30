import React, { useMemo } from "react";
import Modal from "../common/Modal"; // ajustá ruta
import "../../styles/modal.css"; // si no lo estás importando globalmente

const TABLE_KEYS = new Set([
  "ORDER_ID",
  "SKU",
  "DESCRIPTION",
  "QUANTITY",
  "MARKETPLACE",
  "FULFILLMENT",
  "ORDER_CITY",
  "ORDER_STATE",
  "PRODUCT_SALES",
  "DATE_TIME",
  "TOTAL",
  "STATUS",
]);

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const formatMoney = (v) => {
  const n = toNumber(v);
  if (n === null) return String(v ?? "—");
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const prettyKey = (k) =>
  String(k)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());

const normalizeKey = (k) => String(k).toUpperCase();

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
    key.includes("FEE")
  );
};

const SalesOrderDetailsModal = ({ order, onClose }) => {
  const extraFields = useMemo(() => {
    if (!order) return [];

    // 1) De-dupe: si existe ORDER_ID y order_id, nos quedamos con el que sea "más completo"
    const map = new Map(); // normalizedKey -> { key, value }
    for (const [key, value] of Object.entries(order)) {
      const nk = normalizeKey(key);

      // si ya guardamos una versión "upper", preferimos esa
      const existing = map.get(nk);
      if (!existing) {
        map.set(nk, { key, value });
      } else {
        // preferimos el valor que no sea null/undefined/""
        const isEmpty = (v) => v === null || v === undefined || v === "";
        if (isEmpty(existing.value) && !isEmpty(value)) map.set(nk, { key, value });
        // si ambos tienen valor, preferimos el key en MAYÚSCULAS (se ve más “oficial” del backend)
        else if (String(key) === nk && String(existing.key) !== nk) map.set(nk, { key, value });
      }
    }

    // 2) Filtramos los que ya están en tabla
    const entries = Array.from(map.values()).filter(({ key }) => !TABLE_KEYS.has(normalizeKey(key)));

    // 3) Orden lindo: primero cosas “identidad”, después taxes/fees, después resto
    const priority = (k) => {
      const key = normalizeKey(k);
      if (key.includes("SETTLEMENT")) return 1;
      if (key.includes("ACCOUNT")) return 2;
      if (key.includes("TYPE")) return 3;
      if (key.includes("TAX")) return 10;
      if (key.includes("FEES") || key.includes("FEE")) return 11;
      return 50;
    };

    return entries
      .sort((a, b) => priority(a.key) - priority(b.key) || a.key.localeCompare(b.key));
  }, [order]);

  if (!order) return null;

  return (
    <Modal title="Order details" onClose={onClose}>
      <div className="details-grid">
        {extraFields.map(({ key, value }) => {
          const keyUpper = normalizeKey(key);
          const display =
            value === null || value === undefined || value === ""
              ? "—"
              : isMoneyKey(keyUpper)
                ? formatMoney(value)
                : String(value);

          return (
            <div
              key={keyUpper}
              className={`detail-item ${isMoneyKey(keyUpper) ? "number" : ""}`}
            >
              <span>{prettyKey(keyUpper)}</span>
              <span>{display}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default SalesOrderDetailsModal;

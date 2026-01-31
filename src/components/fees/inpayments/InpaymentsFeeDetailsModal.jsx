import React, { useMemo } from "react";
import Modal from "../../common/Modal";
import "../../../styles/modal.css";

// Campos que YA aparecen en tu tabla (no repetir en el modal)
const TABLE_KEYS = new Set([
  "POSTED_DATE_DATE",
  "POSTED_DATE",
  "ID", // settlement id en tu data viene como "id"
  "TYPE",
  "AMOUNT_DESCRIPTION",
  "AMOUNT",
  "STATUS",
  "ORDER_ID",
  "ORDER-ID", // por si viene con guiones
  "ORDER_ID",
  "ORDER_ID",
  "ORDER_ID",
  "SKU",
  "SETTLEMENT-START-DATE",
  "SETTLEMENT-END-DATE",
  "SETTLEMENT_START_DATE",
  "SETTLEMENT_END_DATE",
]);

const normalizeKey = (k) =>
  String(k || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_"); // convierte "settlement-start-date" -> "SETTLEMENT_START_DATE"

const prettyKey = (k) =>
  String(k)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());

const isMoneyKey = (k) => {
  const key = normalizeKey(k);
  return (
    key.includes("AMOUNT") ||
    key.includes("TOTAL") ||
    key.includes("FEE") ||
    key.includes("FEES")
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const isEmpty = (v) => v === null || v === undefined || v === "";

const priority = (k) => {
  const key = normalizeKey(k);
  if (key.includes("DEPOSIT_DATE")) return 1;
  if (key.includes("TOTAL_AMOUNT")) return 2;
  if (key.includes("ORDER_ITEM")) return 4;
  if (key.includes("AMOUNT_DESCRIPTION")) return 6;
  if (key.includes("TYPE")) return 7;
  if (key.includes("STATUS")) return 8;
  return 50;
};

const InpaymentsFeeDetailsModal = ({ fee, onClose }) => {
  const extraFields = useMemo(() => {
    if (!fee) return [];

    // 1) Dedup keys (STATUS vs status, ORDER_ID vs order_id, etc.)
    const map = new Map(); // normalizedKey -> { key, value }
    for (const [key, value] of Object.entries(fee)) {
      const nk = normalizeKey(key);
      const existing = map.get(nk);

      if (!existing) {
        map.set(nk, { key, value });
      } else {
        // preferimos el valor "más útil"
        if (isEmpty(existing.value) && !isEmpty(value)) map.set(nk, { key, value });
        // si ambos tienen valor, preferimos la key más “oficial” (la que viene en mayúscula o con guiones originales)
        else if (String(key).toUpperCase() === String(key) && String(existing.key).toUpperCase() !== String(existing.key)) {
          map.set(nk, { key, value });
        }
      }
    }

    // 2) Sacar lo que ya está en la tabla
    const entries = Array.from(map.values()).filter(
      ({ key }) => !TABLE_KEYS.has(normalizeKey(key))
    );

    // 3) Orden bonito + consistente
    return entries.sort(
      (a, b) => priority(a.key) - priority(b.key) || normalizeKey(a.key).localeCompare(normalizeKey(b.key))
    );
  }, [fee]);

  if (!fee) return null;

  const headerLine = `${fee.TYPE || "Fee"} • ${fee.AMOUNT_DESCRIPTION || "—"}`;

  return (
    <Modal title="Inpayments fee details" onClose={onClose}>
      <div style={{ marginBottom: 10, color: "#6b7280", fontSize: 13 }}>
        {headerLine}
      </div>

      <div className="details-grid">
        {extraFields.map(({ key, value }) => {
          const nk = normalizeKey(key);

          const display = isEmpty(value)
            ? "—"
            : isMoneyKey(nk)
              ? formatMoney(value)
              : String(value);

          return (
            <div key={nk} className={`detail-item ${isMoneyKey(nk) ? "number" : ""}`}>
              <span>{prettyKey(nk)}</span>
              <span>{display}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default InpaymentsFeeDetailsModal;

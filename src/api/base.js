const PROXY_PATH = "/ida-proxy/API/api/Dynamic/process?company=ida";
const FALLBACK_TOKEN = "Gv54n6Et644L4GZ9VLluKX4GTOLfNiWuIST";

function normalizeItem(item) {
  if (!item || typeof item !== "object") return null;

  const order_id = item.ORDER_ID || item.OrderId || item.order_id;
  const sku = item.SKU || item.sku;
  const date_time = item.DATE_TIME || item.DATE || item.date_time;
  const total = item.TOTAL !== undefined ? Number(item.TOTAL) : item.total !== undefined ? Number(item.total) : undefined;
  const status = item.STATUS || item.status || "Unknown";

  return {
    ...item,
    order_id,
    sku,
    date_time,
    total,
    status,
  };
}

export async function idaRequest({ id, type, types, params = {}, limit, raw = false }) {
  const token = import.meta?.env?.VITE_IDA_TOKEN || FALLBACK_TOKEN;

  const body = {
    engine: "Worker"
  };

  // soportar ambos nombres (por compatibilidad)
  if (types) body.types = types;
  if (type) body.type = type;

  if (params.fecha_desde) body.fecha_desde = params.fecha_desde;
  if (params.fecha_hasta) body.fecha_hasta = params.fecha_hasta;
  if (limit) body.limit = limit;

  const res = await fetch(PROXY_PATH, {
    method: "POST",
    headers: {
      accept: "*/*",
      Token: token,
      Id: String(id),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IDA error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (raw) return json;

  const normalized = Array.isArray(json)
    ? json.map(normalizeItem).filter(Boolean)
    : [];

  return limit ? normalized.slice(0, limit) : normalized;
}

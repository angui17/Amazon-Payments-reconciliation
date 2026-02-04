const PROXY_PATH = import.meta?.env?.VITE_API_URL || "http://localhost:3010/api/Dynamic/process";
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
  if (params.settlementId) body.settlementId = params.settlementId;

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

// helper para Service Layer

export async function slRequest(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/b1s/v1${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    // Service Layer usa cookies (B1SESSION). En browser, same-origin proxy -> ok
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  })

  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text || null }

  if (!res.ok) {
    const msg =
      (data && data.error && data.error.message && data.error.message.value) ||
      (data && data.Message) ||
      (typeof data === 'string' ? data : null) ||
      `HTTP ${res.status}`
    throw new Error(msg)
  }

  return data
}

export async function slLogin({ UserName, Password, CompanyDB }) {
  return slRequest('/Login', {
    method: 'POST',
    body: { UserName, Password, CompanyDB }
  })
}

export async function slLogout() {
  // Service Layer tiene /Logout
  return slRequest('/Logout', { method: 'POST' })
}
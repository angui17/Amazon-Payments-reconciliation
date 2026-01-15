const PROXY_PATH = '/ida-proxy/API/api/Dynamic/process?company=IDA';

const FALLBACK_TOKEN = 'Gv54n6Et644L4GZ9VLluKX4GTOLfNiWuIST';

function normalizeItem(item) {
  if (!item || typeof item !== 'object') return null;
  const order_id = item.order_id || item.OrderId || item.orderId || item.AmazonOrderId || item.Id || item.id || item.transactionId || item.TransactionID;
  const sku = item.sku || item.SKU || item.item_sku || item.ItemSKU || item.Sku;
  const date_time = item.date_time || item.date || item.transaction_date || item.CreatedAt || item.created_at || item.transactionDate;
  const totalRaw = item.total || item.amount || item.Total || item.Price || item.price || item.AMOUNT;
  const total = totalRaw === undefined || totalRaw === null ? undefined : Number(totalRaw);
  const status = item.status || item.Status || item.state || item.State || item.Statuses || 'Unknown';
  return { ...item, order_id, sku, date_time, total, status };
}

export async function getOrders(params = {}) {
  // Ignoring params (page/perPage) because external API is not paginated here.
  const token = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_IDA_TOKEN) || process.env.VITE_IDA_TOKEN || FALLBACK_TOKEN;
  // Build request body expected by the IDA Dynamic/process endpoint
  // The IDA portal expects the token, ID and company as query params
  // and the engine/fecha_desde/fecha_hasta (or last) in the JSON body.
  const body = { Token: token, token: token, engine: 'Worker', ID: 257 };
  if (params && params.fecha_desde) body.fecha_desde = params.fecha_desde;
  if (params && params.fecha_hasta) body.fecha_hasta = params.fecha_hasta;
  // Always set last if no dates are provided
  if (!params.fecha_desde && !params.fecha_hasta) {
    body.last = 10;
  }

  console.log('getOrders params:', params);
  console.log('getOrders body:', body);

  const url = `${PROXY_PATH}&token=${encodeURIComponent(token)}&ID=257`;

  // add a timeout to avoid hanging requests
  const controller = new AbortController();
  const timeoutMs = 10000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch("/ida-proxy/API/api/Dynamic/process?company=ida", {
      method: "POST",
      headers: {
        "Token": token,
        "Id": 257,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
  } catch (e) {
    clearTimeout(timeout);
    if (e.name === 'AbortError') throw Object.assign(new Error('Request timed out'), { request: { url, body } });
    throw Object.assign(new Error(e.message || 'Network error'), { request: { url, body } });
  }
  clearTimeout(timeout);

  let json = null;
  if (!res.ok) {
    // try fallback endpoint if token validation error
    const txt = await res.text().catch(() => '');
    try { json = txt ? JSON.parse(txt) : null } catch (e) { json = txt }
    const tokenError = json && json.errors && json.errors.Token;
    if (tokenError) {
      // fallback: try /API/automatic/process with token in body (different contract)
      const altPath = '/ida-proxy/API/automatic/process?company=IDA';
      const altBody = Object.assign({ company: 'IDA', token: token, ID: 257 }, (params && params.fecha_desde) ? { fecha_desde: params.fecha_desde } : {}, (params && params.fecha_hasta) ? { fecha_hasta: params.fecha_hasta } : {}, (!params.fecha_desde && !params.fecha_hasta) ? { last: 10 } : {});
      let altRes;
      try {
        altRes = await fetch(altPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(altBody)
        });
      } catch (e) {
        const txt2 = e && e.message ? e.message : '';
        throw new Error(`Fallback request failed: ${txt2} -- primary:${res.status} ${JSON.stringify(json)}`);
      }
      if (altRes.ok) {
        const altJson = await altRes.json().catch(() => null);
        // Normalize altJson
        let itemsAlt = [];
        if (Array.isArray(altJson)) itemsAlt = altJson;
        else if (altJson && Array.isArray(altJson.data)) itemsAlt = altJson.data;
        else if (altJson && Array.isArray(altJson.Items)) itemsAlt = altJson.Items;
        else if (altJson && altJson.Result && Array.isArray(altJson.Result)) itemsAlt = altJson.Result;
        else if (altJson && typeof altJson === 'object') {
          const arr = Object.values(altJson).find((v) => Array.isArray(v));
          if (arr) itemsAlt = arr;
        }
        const dataAlt = (itemsAlt || []).map(normalizeItem).filter(Boolean);
        return { data: dataAlt };
      }
      const altTxt = await altRes.text().catch(() => '');
      throw Object.assign(new Error(`IDA API primary token error; fallback responded ${altRes.status} ${altTxt} -- primary:${res.status} ${txt}`), { request: { url, body }, fallback: { url: altPath, body: altBody, status: altRes.status, text: altTxt } });
    }
    throw Object.assign(new Error(`IDA API error: ${res.status} ${txt} -- request: ${url} body:${JSON.stringify(body)}`), { request: { url, body }, responseText: txt });
  } else {
    json = await res.json().catch(() => null);
  }
  // The external API may return an object with data property or an array directly.
  let items = [];
  if (Array.isArray(json)) items = json;
  else if (json && Array.isArray(json.data)) items = json.data;
  else if (json && Array.isArray(json.Items)) items = json.Items;
  else if (json && json.Result && Array.isArray(json.Result)) items = json.Result;
  else if (json && typeof json === 'object') {
    // attempt to find the first array value
    const arr = Object.values(json).find((v) => Array.isArray(v));
    if (arr) items = arr;
  }

  const data = (items || []).map(normalizeItem).filter(Boolean);
  return { data };
}

export async function getOrder(id) {
  // Fallback: fetch all and find by id 
  const res = await getOrders();
  const found = (res.data || []).find((r) => String(r.order_id) === String(id) || String(r.id) === String(id));
  return { data: found || null };
}

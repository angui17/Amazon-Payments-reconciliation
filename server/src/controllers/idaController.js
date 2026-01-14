const fetch = require('node-fetch');
const config = require('../config');

function normalizeItem(item) {
  if (!item || typeof item !== 'object') return null;
  const order_id = item.ORDER_ID || item.OrderId || item.orderId || item.AmazonOrderId || item.Id || item.id || item.transactionId || item.TransactionID;
  const sku = item.SKU || item.sku || item.item_sku || item.ItemSKU || item.Sku;
  const date_time = item.DATE_TIME || item.date_time || item.date || item.transaction_date || item.CreatedAt || item.created_at || item.transactionDate;
  const totalRaw = item.TOTAL || item.total || item.amount || item.Total || item.Price || item.price || item.AMOUNT;
  const total = totalRaw === undefined || totalRaw === null ? undefined : Number(totalRaw);
  const status = item.STATUS || item.status || item.State || item.state || item.Status;
  return Object.assign({}, item, { order_id, sku, date_time, total, status });
}

exports.list = async (req, res, next) => {
  try {
    const { fecha_desde, fecha_hasta, last } = req.body || {};
    const idaUrl = config.ida && config.ida.url ? config.ida.url : process.env.IDA_API_URL;
    const token = config.ida && config.ida.apiKey ? config.ida.apiKey : process.env.IDA_API_KEY || process.env.IDA_TOKEN;
    if (!idaUrl) return res.status(500).json({ error: 'IDA API URL not configured' });
    if (!token) return res.status(500).json({ error: 'IDA token not configured' });

    const body = { Token: token, engine: 'Worker' };
    if (fecha_desde) body.fecha_desde = fecha_desde;
    if (fecha_hasta) body.fecha_hasta = fecha_hasta;
    if (!fecha_desde && !fecha_hasta) body.last = last || 10;

    const response = await fetch(idaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null } catch (e) { json = text }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'IDA error', details: json });
    }

    // normalize possible response shapes
    let items = [];
    if (Array.isArray(json)) items = json;
    else if (json && Array.isArray(json.data)) items = json.data;
    else if (json && Array.isArray(json.Items)) items = json.Items;
    else if (json && json.Result && Array.isArray(json.Result)) items = json.Result;
    else if (json && typeof json === 'object') {
      const arr = Object.values(json).find((v) => Array.isArray(v));
      if (arr) items = arr;
    }

    const data = (items || []).map(normalizeItem).filter(Boolean);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

const config = require('../config');

function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (config.ida && config.ida.apiKey) headers.Authorization = `Bearer ${config.ida.apiKey}`;
  return headers;
}

async function request(path, options = {}) {
  if (!config.ida || !config.ida.url) throw new Error('IDA client not configured');
  const url = new URL(path, config.ida.url).toString();
  const res = await fetch(url, {
    headers: Object.assign(buildHeaders(), options.headers || {}),
    method: options.method || 'GET',
    body: options.body
  });
  const text = await res.text();
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch (e) { payload = text; }
  if (!res.ok) {
    const err = new Error(`IDA request failed ${res.status}`);
    err.status = res.status;
    err.body = payload;
    throw err;
  }
  return payload;
}

async function query(sql, params = []) {
  // Expecting IDA to expose a /query endpoint that accepts { sql, params }
  return request('/query', {
    method: 'POST',
    body: JSON.stringify({ sql, params })
  });
}

module.exports = { request, query };

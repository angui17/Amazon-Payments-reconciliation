const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function buildUrl(path, params) {
  const url = new URL(path, baseURL);
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((k) => {
      const val = params[k];
      if (val !== undefined && val !== null) url.searchParams.append(k, String(val));
    });
  }
  return url.toString();
}

async function request(method, path, { params, body, headers } = {}) {
  const url = buildUrl(path, params);
  const opts = {
    method: method.toUpperCase(),
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {})
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  let data = null;
  const text = await res.text();
  try { data = text ? JSON.parse(text) : null } catch (e) { data = text }
  return { data, status: res.status, ok: res.ok };
}

export default {
  get: (path, opts) => request('get', path, opts),
  post: (path, opts) => request('post', path, opts),
  put: (path, opts) => request('put', path, opts),
  delete: (path, opts) => request('delete', path, opts)
};

import { useState, useEffect } from 'react';
import { getOrders } from '../api/orders';

export default function useOrdersApi({ page = 1, perPage = 25, filters = {}, refresh = 0 } = {}) {
  const [state, setState] = useState({ data: [], loading: true, error: null, info: null });

  useEffect(() => {
    let mounted = true;
    setState({ data: [], loading: true, error: null, info: null });
    getOrders({ page, perPage, ...filters }).then(res => {
      if (!mounted) return;
      setState({ data: res.data || [], loading: false, error: null, info: null });
    }).catch((err) => {
      if (!mounted) return;
      const message = err && err.message ? err.message : 'Failed to load orders';
      const info = { request: err && err.request, responseText: err && err.responseText, fallback: err && err.fallback };
      setState({ data: [], loading: false, error: message, info });
    });
    return () => { mounted = false };
  }, [page, perPage, JSON.stringify(filters), refresh]);

  return state;
}
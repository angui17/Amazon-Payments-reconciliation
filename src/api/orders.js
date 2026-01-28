import { idaRequest } from './base.js';

export async function getOrders(params = {}, limit = 10) {
  try {
    const data = await idaRequest({
      id: 257,            
      type: 'Orders',      
      params,
      limit
    });
    return { data };
  } catch (error) {
    console.error('getOrders error:', error);
    return { data: [], error: error.message || 'Unknown error' };
  }
}

export async function getOrder(id) {
  try {
    const { data } = await getOrders({}); // traer últimas órdenes
    const found = data.find(
      (r) => String(r.order_id) === String(id) || String(r.id) === String(id)
    );
    return { data: found || null };
  } catch (error) {
    console.error('getOrder error:', error);
    return { data: null, error: error.message || 'Unknown error' };
  }
}

// 261: Sales 
// 262: Payments
export const getOrdersSales = ({ fecha_desde, fecha_hasta, limit }) => {
  return idaRequest({
    id: 261,
    type: "ORDER",
    params: { fecha_desde, fecha_hasta },
    limit,
  });
};

export const getOrdersPayments = ({ fecha_desde, fecha_hasta, limit }) => {
  return idaRequest({
    id: 262,              // Payments
    type: "ORDER",
    params: { fecha_desde, fecha_hasta},
    limit,
  });
};
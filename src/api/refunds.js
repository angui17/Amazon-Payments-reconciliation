import { idaRequest } from "./base";

// 261: Sales 
// 262: Payments
export const getRefundsSales = ({ fecha_desde, fecha_hasta, limit }) => {
  return idaRequest({
    id: 261,
    type: "REFUND",
    params: { fecha_desde, fecha_hasta },
    limit,
  });
};

export const getRefundsPayments = ({ fecha_desde, fecha_hasta, limit }) => {
  return idaRequest({
    id: 262,
    type: "REFUND",
    params: { fecha_desde, fecha_hasta },
    limit,
  });
};
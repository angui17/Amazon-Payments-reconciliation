import { idaRequest } from "./base";

export const getRefunds = ({ fecha_desde, fecha_hasta, limit }) => {
  return idaRequest({
    id: 261,
    type: "REFUND",
    params: { fecha_desde, fecha_hasta },
    limit,
  });
};
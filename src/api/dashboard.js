import { idaRequest } from "./base";

// WS (265) 
/*
{
  "engine": "Worker",
  "fecha_desde": "01-01-2025",
  "fecha_hasta": "01-31-2025",
  "status": "ALL",
  "limit_records": 50
}
*/

export const getDashboard = ({ fecha_desde, fecha_hasta, limit_records = 50, status = "ALL" }) => {
    return idaRequest({
        id: 265,
        params: {
            fecha_desde,
            fecha_hasta,
            status: "ALL",
            limit_records,
        },
        raw: true
    });
}
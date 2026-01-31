import { idaRequest } from "./base";

// WS (265) 
export const getDashboard = ({ fecha_desde, fecha_hasta, limit_records = 50, status = "ALL" }) => {
    return idaRequest({
        id: 265,
        params: {
            fecha_desde,
            fecha_hasta,
            status,
            limit_records,
        },
        raw: true
    });
}
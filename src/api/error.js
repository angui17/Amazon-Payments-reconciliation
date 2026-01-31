import { idaRequest } from "./base";

export const getErrors = ({ fecha_desde, fecha_hasta, limit_records = 50, status = "ALL" }) => {
    return idaRequest({
        id: 267,
        params: {
            fecha_desde,
            fecha_hasta,
            status,
            limit_records,
        },
        raw: true
    });
}

export const getErrorsSummary279 = ({ fecha_desde, fecha_hasta, limit_records = 50, status = "ALL" }) => {
    return idaRequest({
        id: 279,
        params: {
            fecha_desde,
            fecha_hasta,
            status,
            limit_records,
            only_exceptions: 0,
            top_n: 20,
        },
        raw: true,
    });
};
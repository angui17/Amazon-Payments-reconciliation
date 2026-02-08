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

/* Settlement Exception Detail (WS 268) */
export const getSettlementErrorsDetail = ({ settlementId, limit_rows = 300, txn_types_csv = "", amount_desc_like = "" }) => {
    return idaRequest({
        id: 268,
        params: {
            settlementId,
            limit_rows,
            txn_types_csv,
            amount_desc_like,
        },
        raw: true,
    });
}
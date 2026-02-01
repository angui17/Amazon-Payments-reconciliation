// (WS 269)
import { idaRequest } from "./base";

export const getAccounting = ({ fecha_desde, fecha_hasta, limit_records = 50, status = "ALL" }) => {
    return idaRequest({
        id: 269,
        params: {
            fecha_desde,
            fecha_hasta,
            status,
            limit_records,
        },
        raw: true
    });
}

export const getAccountingSettlementDetails = ({ settlementId }) => {
    return idaRequest({
        id: 266,
        params: { settlementId: String(settlementId) },
        raw: true
    });
}
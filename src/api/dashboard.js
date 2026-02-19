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

// WS (266)
export const getADashboardSettlementDetails = ({ settlementId }) => {
    return idaRequest({
        id: 266,
        params: { settlementId: String(settlementId) },
        raw: true
    });
}

// WS (280)
export const getSapInvoicesBySettlement = ({ settlementId, limit_records = 50 }) => {
    return idaRequest({
        id: 280,
        params: {
            settlementId: String(settlementId),
            limit_records,
        }
    });
}
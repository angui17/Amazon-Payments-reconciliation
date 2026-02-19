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

export const getMissingFeeAccounts = ({ fecha_desde, fecha_hasta, limit_records = 50 }) => {
    return idaRequest({
        id: 281,
        params: {
            fecha_desde,
            fecha_hasta,
            limit_records,
        },
        raw: true
    });
}

export const JournalEntries = ({ settlementId }) => {
    return idaRequest({
        id: 270,
        params: { settlementId: String(settlementId) },
        raw: true
    });
}

export const exceptionsSettlement = ({ settlementId }) => {
    return idaRequest({
        id: 282,
        params: { settlementId: String(settlementId) },
        raw: true
    });
}


export const getSapInvoicesBySettlement  = ({ settlementId }) => {
    return idaRequest({
        id: 280,
        params: { settlementId: String(settlementId) },
        raw: true
    });
}
// (WS 271)
import { idaRequest } from "./base";

export const getReports = ({ fecha_desde, fecha_hasta, limit_records = 50, status = "ALL" }) => {
    return idaRequest({
        id: 271,
        params: {
            fecha_desde,
            fecha_hasta,
            status,
            limit_records,
        },
        raw: true
    });
}

// 272 -> Falta el settlementId
// export const getReportsSettlement = ({  settlementId  }) => {
//     return idaRequest({
//         id: 272,
//           params: { settlementId: String(settlementId) },
//         raw: true
//     });
// }
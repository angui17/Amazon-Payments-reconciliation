/* Sales fees ID 263
Inpayments fees ID 264 */
import { idaRequest } from './base.js';

export const getFeesSales = (params = {}) => {
  return idaRequest({
    id: 263,
    types: "ADJUSTMENT,AMAZON FEES,FBA INVENTORY FEE,FBA INVENTORY FEE - REVERSAL,FBA TRANSACTION FEES,FEE ADJUSTMENT,LIQUIDATIONS,LIQUIDATIONS ADJUSTMENTS,ORDER_RETROCHARGE,REFUND_RETROCHARGE,SERVICE FEE",
    last: 50,
    params
  });
};

export const getFeesPayments = (params = {}) => {
  return idaRequest({
    id: 264,
    types: "ADJUSTMENT,AMAZON FEES,FBA INVENTORY FEE,FBA INVENTORY FEE - REVERSAL,FBA TRANSACTION FEES,FEE ADJUSTMENT,LIQUIDATIONS,LIQUIDATIONS ADJUSTMENTS,ORDER_RETROCHARGE,REFUND_RETROCHARGE,SERVICE FEE",
    last: 50,
    params
  });
};
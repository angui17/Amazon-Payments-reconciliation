import React from "react";
import Modal from "../common/Modal";
import "../../styles/modal.css";

const RefundDetailsModal = ({ refund, onClose }) => {
    if (!refund) return null;

    return (
        <Modal title={`Refund Details – Order ${refund.order_id}`} onClose={onClose}>
            <div className="details-grid">
                <Detail label="ID Unique" value={refund.ID_UNIQUE} />
                <Detail label="Date / Time" value={refund.DATE_TIME} />
                <Detail label="Marketplace" value={refund.MARKETPLACE} />
                <Detail label="Account Type" value={refund.ACCOUNT_TYPE} />
                <Detail label="Fulfillment" value={refund.FULFILLMENT} />
                <Detail label="Selling Fees" value={refund.SELLING_FEES} isMoney />
                <Detail label="FBA Fees" value={refund.FBA_FEES} isMoney />
                <Detail label="Order Location" value={`${refund.ORDER_CITY}, ${refund.ORDER_STATE} ${refund.ORDER_POSTAL}`} />
                <Detail label="Tax Model" value={refund.TAX_COLLECTION_MODEL} />
                <Detail label="Product Sales Tax" value={refund.PRODUCT_SALES_TAX} isMoney />
                <Detail label="Shipping Credits" value={refund.SHIPPING_CREDITS} isMoney />
                <Detail label="Shipping Credits Tax" value={refund.SHIPPING_CREDITS_TAX} isMoney />
                <Detail label="Promotional Rebates" value={refund.PROMOTIONAL_REBATES} isMoney />
                <Detail label="Marketplace Withheld Tax" value={refund.MARKETPLACE_WITHHELD_TAX} isMoney />
                <Detail label="Other Fees" value={refund.OTHER_TRANSACTION_FEES} isMoney />
                <Detail label="Regulatory Fee" value={refund.REGULATORY_FEE} isMoney />
                <Detail label="Tax on Regulatory Fee" value={refund.TAX_ON_REGULATORY_FEE} isMoney />
            </div>
        </Modal>
    );
};

const Detail = ({ label, value, isMoney }) => (
    <div className={`detail-item ${isMoney ? "number" : ""}`}>
        <span>{label}</span>
        <span>{isMoney ? `$${value ?? "0.00"}` : value || "—"}</span>
    </div>
);

export default RefundDetailsModal;

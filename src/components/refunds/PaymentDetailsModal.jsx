import React from "react";
import Modal from "../common/Modal";
import "../../styles/modal.css";

const onlyDate = (v) => (typeof v === "string" ? v.split(" ")[0] : v || "—");

const PaymentDetailsModal = ({ payment, onClose }) => {
  if (!payment) return null;

  const orderId = payment.ORDER_ID || payment.order_id || "—";

  return (
    <Modal title={`Payment Details – Order ${orderId}`} onClose={onClose}>
      <div className="details-grid">
        <Detail label="Type" value={payment.TYPE} />
        <Detail label="Deposit Date" value={onlyDate(payment["deposit-date"])} />
        <Detail label="Order Item" value={payment["order-item"]} />
        <Detail label="Total Amount" value={payment["total-amount"]} isMoney />
        <Detail label="Record ID" value={payment.id} />
      </div>
    </Modal>
  );
};

const Detail = ({ label, value, isMoney }) => {
  const num = Number(value);
  const isValidNum = Number.isFinite(num);

  return (
    <div className={`detail-item ${isMoney ? "number" : ""}`}>
      <span>{label}</span>
      <span>{isMoney ? (isValidNum ? `$${num.toFixed(2)}` : "—") : (value || "—")}</span>
    </div>
  );
};

export default PaymentDetailsModal;

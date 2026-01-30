import { useParams } from "react-router-dom";
import RefundsSales from "../refunds/RefundsSales";
import RefundsPayments from "../refunds/RefundsPayments";

const Refunds = () => {
  const { type } = useParams(); // sales | payments

  if (type === "sales") return <RefundsSales />;
  if (type === "payments") return <RefundsPayments />;

  return <div>Invalid refunds type</div>;
};

export default Refunds;

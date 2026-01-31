import { useParams } from "react-router-dom"
import SalesFees from '../fees/sales/SalesFees';
import InpaymentsFees from '../fees/inpayments/InpaymentsFees';

const Fees = () => {
  const { type } = useParams(); // sales | payments

  if (type === "sales") return <SalesFees />
  if (type === "payments") return <InpaymentsFees />;

  return <div>Invalid orders type</div>;
};

export default Fees;
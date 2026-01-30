import {useParams} from "react-router-dom"
import SalesOrders from "../orders/SalesOrders";
import SalesInpayemts from "../orders/SalesInpayemts";

const Orders = () => {
  const { type } = useParams(); // sales | payments

  if (type === "sales") return <SalesOrders />
  if (type === "payments") return <SalesInpayemts />;

  return <div>Invalid orders type</div>;
}

export default Orders
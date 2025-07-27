import { useEffect } from "react";
import Order from "../Order";
import orderService from "../../api/orderService";

function ListOrders({ orderStatus }) {
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrder(orderStatus);
        console.log(res.data);
      } catch (error) {}
    };
    fetchOrder();
  }, []);

  return <div>{<Order />}</div>;
}

export default ListOrders;

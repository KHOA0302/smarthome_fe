import { useEffect, useRef, useState } from "react";
import styles from "./Order.module.scss";
import classNames from "classnames/bind";
import OrderList from "../../../Component/OrderList";
import orderService from "../../../api/orderService";
import { FilterIcon } from "../../../icons";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router";
import FilterForProductManagementTable from "../../../Component/FilterForProductManagementTable";
import { useSocket } from "../../../context/SocketContext";
const cx = classNames.bind(styles);
const lookupTypes = {
  pending: "Chờ xử lý",
  preparing: "Đang chuẩn bị hàng",
  shipping: "Đang giao hàng",
  completed: "Giao hàng thành công",
  cancel: "Hủy",
};
function Order() {
  const [loadListOrder, setLoadListOrder] = useState(false);
  const location = useLocation();
  const orderStatus = location.state ? [location.state] : [];
  const [orderTypes, setOrderTypes] = useState([]);
  const [orders, setOrders] = useState([]);
  const { notificationState, isConnected } = useSocket();

  const fetchOrders = () => {
    setLoadListOrder(true);
    const fetchOrdersPromise = orderService.getOrderCustomer(orderTypes);
    toast
      .promise(fetchOrdersPromise, {
        pending: "Đang tải danh sách đơn hàng...",
        success: "Tải đơn hàng thành công! 🎉",
        error: "Lỗi",
      })
      .then((res) => {
        if (res.status === 200) {
          setOrders(res.data);
         
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải đơn hàng:", error);
      })
      .finally(() => {
        setLoadListOrder(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [orderTypes]);

  const handleFilterOrderTypes = (type) => {
    setOrderTypes([...orderTypes.filter((t) => t !== type)]);
  };

  const handleOrderAddType = (type) => {
    if (orderTypes.includes(type)) {
      setOrderTypes([...orderTypes.filter((t) => t !== type)]);
    } else {
      setOrderTypes((prev) => [...prev, type]);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <FilterForProductManagementTable
          customerDashboard={true}
          orderMode={true}
          handleOrderAddType={handleOrderAddType}
          orderTypes={orderTypes}
          handleFilterOrderTypes={handleFilterOrderTypes}
          fetchOrders={fetchOrders}
          notifications={notificationState}
        />
        <div className={cx("orders")}>
          <OrderList orders={orders} loadListOrder={loadListOrder} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Order;

import styles from "./InvoiceManagement.module.scss";
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import OrderList from "../../../Component/OrderList";
import orderService from "../../../api/orderService";
import { ToastContainer, toast } from "react-toastify";
import FilterForProductManagementTable from "../../../Component/FilterForProductManagementTable";
import { useSocket } from "../../../context/SocketContext";

const cx = classNames.bind(styles);
function InvoiceManagement() {
  const [loadListOrder, setLoadListOrder] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const { notificationState, isConnected } = useSocket();

  const fetchOrders = () => {
    setLoadListOrder(true);
    const fetchOrdersPromise = orderService.getOrderAdmin(orderTypes);
    toast
      .promise(fetchOrdersPromise, {
        pending: "Đang tải danh sách đơn hàng...",
        success: "Tải đơn hàng thành công! 🎉",
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

  const handleOrderAddType = (type) => {
    if (orderTypes.includes(type)) {
      setOrderTypes([...orderTypes.filter((t) => t !== type)]);
    } else {
      setOrderTypes((prev) => [...prev, type]);
    }
  };

  const handleFilterOrderTypes = (type) => {
    setOrderTypes([...orderTypes.filter((t) => t !== type)]);
  };

  

  return (
    <div className={cx("wrapper")}>
      <ToastContainer />
      <div className={cx("container")}>
        <FilterForProductManagementTable
          adminDashboard={true}
          orderMode={true}
          handleOrderAddType={handleOrderAddType}
          orderTypes={orderTypes}
          handleFilterOrderTypes={handleFilterOrderTypes}
          fetchOrders={fetchOrders}
          notifications={notificationState}
        />
        <div className={cx("orders")}>
          <OrderList
            orders={orders}
            setOrders={setOrders}
            role="admin"
            loadListOrder={loadListOrder}
          />
        </div>
      </div>
    </div>
  );
}
export default InvoiceManagement;

import { useEffect, useRef, useState } from "react";
import styles from "./Order.module.scss";
import classNames from "classnames/bind";
import OrderList from "../../../Component/OrderList";
import orderService from "../../../api/orderService";
import { FilterIcon } from "../../../icons";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router";
const cx = classNames.bind(styles);
const lookupTypes = {
  pending: "Chờ xử lý",
  preparing: "Đang chuẩn bị hàng",
  shipping: "Đang giao hàng",
  completed: "Giao hàng thành công",
  cancel: "Hủy",
};
function Order() {
  const location = useLocation();
  const orderStatus = location.state ? [location.state] : [];
  const [types, setTypes] = useState([...orderStatus]);
  const [orders, setOrders] = useState([]);
  const [showFilterOption, setShowFilterOption] = useState(false);

  useEffect(() => {
    const fetchOrdersPromise = orderService.getOrderCustomer(types);

    toast
      .promise(fetchOrdersPromise, {
        pending: "Đang tải danh sách đơn hàng...",
        error: "Có lỗi rồi😔😔",
      })
      .then((res) => {
        setOrders(res.data);
        if (res.status === 200) {
          toast.success("Tải đơn hàng thành công! 🎉");
        } else if (res.status === 204) {
          toast.warning(
            `Không có đơn hàng ${types[types.length - 1]} nào 😔😔`
              .replace(/\s\s+/g, " ")
              .trim()
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải đơn hàng:", error);
      });
  }, [types]);

  const handleAddType = (type) => {
    if (types.includes(type)) {
      setTypes([...types.filter((t) => t !== type)]);
    } else {
      setTypes((prev) => [...prev, type]);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("filter")}>
          <div className={cx("filter-main")}>
            <button
              className={cx("filter-btn", { show: showFilterOption })}
              onClick={() => setShowFilterOption(!showFilterOption)}
            >
              <span>LỌC ĐƠN HÀNG</span>
              <FilterIcon />
            </button>
            <div className={cx("filter-option", { show: showFilterOption })}>
              <div
                className={cx("filter-option-wrapper", {
                  show: showFilterOption,
                })}
              >
                <button
                  onClick={() => handleAddType("pending")}
                  className={cx({ active: types.includes("pending") })}
                >
                  Chờ sử lý
                </button>
                <button
                  onClick={() => handleAddType("preparing")}
                  className={cx({ active: types.includes("preparing") })}
                >
                  Đang chuẩn bị hàng
                </button>
                <button
                  onClick={() => handleAddType("shipping")}
                  className={cx({ active: types.includes("shipping") })}
                >
                  Đang giao
                </button>
                <button
                  onClick={() => handleAddType("completed")}
                  className={cx({ active: types.includes("completed") })}
                >
                  Giao thành công
                </button>
                <button
                  onClick={() => handleAddType("cancel")}
                  className={cx({ active: types.includes("cancel") })}
                >
                  Đã hủy
                </button>
              </div>
            </div>
          </div>
          <ul>
            {types.map((type, id) => {
              return (
                <li key={id}>
                  <span>{lookupTypes[type]}</span>
                  <button
                    onClick={() =>
                      setTypes([...types.filter((t) => t !== type)])
                    }
                  >
                    x
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={cx("orders")}>
          <OrderList orders={orders} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Order;

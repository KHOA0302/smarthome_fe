import { useEffect, useRef, useState } from "react";
import styles from "./Order.module.scss";
import classNames from "classnames/bind";
import OrderList from "../../../Component/OrderList";
import orderService from "../../../api/orderService";
import { FilterIcon } from "../../../icons";
import { ToastContainer, toast } from "react-toastify";
const cx = classNames.bind(styles);
const lookupTypes = {
  pending: "Chờ xử lý",
  preparing: "Đang chuẩn bị hàng",
  shipping: "Đang giao hàng",
  completed: "Giao hàng thành công",
  cancel: "Hủy",
};
function Order() {
  const [types, setTypes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showFilterOption, setShowFilterOption] = useState(false);
  const currentToastId = useRef(null);

  useEffect(() => {
    if (currentToastId.current) {
      toast.dismiss(currentToastId.current);
    }
    const fetchOrdersPromise = orderService.getOrderCustomer(types);

    currentToastId.current = toast
      .promise(fetchOrdersPromise, {
        pending: "Đang tải danh sách đơn hàng...",
        success: "Tải đơn hàng thành công! 🎉",
        error: "Có lỗi xảy ra khi tải đơn hàng. 😢",
      })
      .then((res) => {
        if (res.status === 200) {
          setOrders(res.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải đơn hàng:", error);
      });
    return () => {
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current);
      }
    };
  }, [types]);

  const handleAddType = (type) => {
    console.log(type, types);
    if (types.includes(type)) {
      setTypes([...types.filter((t) => t !== type)]);
    } else {
      setTypes((prev) => [...prev, type]);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <ToastContainer />
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
                <li>
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
    </div>
  );
}

export default Order;

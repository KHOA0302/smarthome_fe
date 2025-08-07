import { useState } from "react";
import styles from "./Order.module.scss";
import classNames from "classnames/bind";
import OrderList from "../../../Component/OrderList";
const cx = classNames.bind(styles);
function Order() {
  const [type, setType] = useState("pending");

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div>
          <button>Chờ sử lý</button>
          <button>Đang chuẩn bị hàng</button>
          <button>Đang giao</button>
          <button>Giao thành công</button>
          <button>Đã hủy</button>
        </div>
        <div className={cx("blank")}>
          <OrderList type={type} />
        </div>
      </div>
    </div>
  );
}

export default Order;

import classNames from "classnames/bind";
import styles from "./OrderList.module.scss";
import { useEffect } from "react";
import orderService from "../../api/orderService";
const cx = classNames.bind(styles);
function OrderList({ type }) {
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await orderService.getOrderAdmin(type);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}></div>
    </div>
  );
}

export default OrderList;

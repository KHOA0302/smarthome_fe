import styles from "./CustomerLayout.module.scss";
import classNames from "classnames/bind";
import { Outlet } from "react-router-dom";

import Navbar from "../../Component/Navbar";
import { CartIcon, InvoiceIcon, UserInfoIcon } from "../../icons";

const cx = classNames.bind(styles);

const navItems = [
  {
    name: "Dasboard",
    icon: UserInfoIcon,
    route: "/customer/dashboard",
  },
  {
    name: "Đơn hàng hàng",
    icon: InvoiceIcon,
    route: "/customer/order",
  },
];
function CustomerLayout() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container-side_bar")}>
        <Navbar navItems={navItems} />
      </div>
      <div className={cx("container-content")}>
        <Outlet />
      </div>
    </div>
  );
}

export default CustomerLayout;

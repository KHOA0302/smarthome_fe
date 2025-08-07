import styles from "./CustomerLayout.module.scss";
import classNames from "classnames/bind";
import { Outlet } from "react-router-dom";

import Navbar from "../../Component/Navbar";
import { InvoiceIcon, UserInfoIcon } from "../../icons";

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
      <Navbar navItems={navItems} />
      <Outlet />
    </div>
  );
}

export default CustomerLayout;

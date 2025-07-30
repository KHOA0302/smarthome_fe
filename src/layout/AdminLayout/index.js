import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.scss";
import classNames from "classnames/bind";
import {
  AddIcon,
  ChartIcon,
  EditIcon,
  InvoiceIcon,
  UserInfoIcon,
} from "../../icons";
import Navbar from "../../Component/Navbar";

const cx = classNames.bind(styles);

const navItems = [
  {
    name: "Dasboard",
    icon: UserInfoIcon,
    route: "/admin/dashboard",
  },
  {
    name: "Thêm sản phẩm",
    icon: AddIcon,
    route: "/admin/add-product",
  },
  {
    name: "Thống kê đơn hàng",
    icon: ChartIcon,
    route: "/admin/statistic",
  },
  {
    name: "Chỉnh sửa sản phẩm",
    icon: EditIcon,
    route: "/admin/edit-product",
  },
  {
    name: "Quản lý đơn hàng",
    icon: InvoiceIcon,
    route: "/admin/invoice",
  },
];

function AdminLayout() {
  return (
    <div className={cx("wrapper")}>
      <Navbar navItems={navItems} />
      <Outlet />
    </div>
  );
}

export default AdminLayout;

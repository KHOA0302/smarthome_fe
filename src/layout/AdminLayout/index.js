import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.scss";
import classNames from "classnames/bind";
import {
  AddIcon,
  ChartIcon,
  EditIcon,
  InvoiceIcon,
  PromotionIcon,
  UserInfoIcon,
} from "../../icons";
import Navbar from "../../Component/Navbar";
import { TbPencilCog } from "react-icons/tb";

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
    name: "Quản lý tổng hợp",
    icon: TbPencilCog,
    route: "/admin/brand-category-option-service-spec",
  },
  {
    name: "Quản lý đơn hàng",
    icon: InvoiceIcon,
    route: "/admin/invoice",
  },
  {
    name: "Quản lý giảm giá tồn kho",
    icon: PromotionIcon,
    route: "/admin/promotion",
  },
];

function AdminLayout() {
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

export default AdminLayout;

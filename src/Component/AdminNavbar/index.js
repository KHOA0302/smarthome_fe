import styles from "./AdminNavbar.module.scss";
import classNames from "classnames/bind";
import {
  AddIcon,
  ChartIcon,
  EditIcon,
  InvoiceIcon,
  UserInfoIcon,
} from "../../icons";
import zaku from "../../images/zaku.png";
import { NavLink } from "react-router-dom";

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

function AdminNavbar() {
  const admin = JSON.parse(localStorage.getItem("user_info"));
  console.log(admin);
  return (
    <nav className={cx("wrapper")}>
      <h1>SmartHome</h1>
      <div className={cx("user")}>
        <div className={cx("user-wrapper")}>
          <img src={zaku} alt="avatar" />
          <span>Zaku</span>
        </div>
      </div>
      <div className={cx("navbar-option")}>
        {navItems.map((item, id) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={id}
              to={item.route}
              className={({ isActive }) =>
                cx("navbar-item", { active: isActive })
              }
            >
              <div className={cx("item-container")}>
                <Icon />
                <span>{item.name}</span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default AdminNavbar;

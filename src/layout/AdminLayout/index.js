import { Outlet } from "react-router-dom";
import AdminNavbar from "../../Component/AdminNavbar";
import styles from "./AdminLayout.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function AdminLayout() {
  return (
    <div className={cx("wrapper")}>
      <AdminNavbar />
      <Outlet />
    </div>
  );
}

export default AdminLayout;

import OutStockAlert from "../../../Component/OutStockAlert";
import ProductManagementTable from "../../../Component/ProductManagementTable";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
function Dashboard() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <ProductManagementTable />
      </div>
    </div>
  );
}

export default Dashboard;

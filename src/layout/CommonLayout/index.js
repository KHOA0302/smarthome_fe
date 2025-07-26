import styles from "./CommonLayout.module.scss";
import classNames from "classnames/bind";
import { Outlet } from "react-router-dom";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";

const cx = classNames.bind(styles);

function CommonLayout() {
  return (
    <div className={cx("wrapper")}>
      <Header />
      <div className={cx("container")}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default CommonLayout;

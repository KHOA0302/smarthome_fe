import styles from "./CustomerLayout.module.scss";
import classNames from "classnames/bind";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import NotFound from "../../Pages/NotFound";
import { Dashboard } from "../../Pages/Customer";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";

const cx = classNames.bind(styles);

function CustomerLayout() {
  return <Outlet />;
}

export default CustomerLayout;

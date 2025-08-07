import styles from "./CommonLayout.module.scss";
import classNames from "classnames/bind";
import { Outlet } from "react-router-dom";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import { createContext, useState } from "react";
import { useGetContext } from "../../hooks/useGetContext";

const cx = classNames.bind(styles);

export const createCartItemQuantContext = createContext();

export const useCartItemQuantContext = () => {
  return useGetContext(createCartItemQuantContext);
};

function CommonLayout() {
  const [cartItemQuant, setCartItemQuant] = useState(0);
  return (
    <createCartItemQuantContext.Provider
      value={{ cartItemQuant, setCartItemQuant }}
    >
      <div className={cx("wrapper")}>
        <Header />
        <div className={cx("container")}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </createCartItemQuantContext.Provider>
  );
}

export default CommonLayout;

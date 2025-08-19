import styles from "./CommonLayout.module.scss";
import classNames from "classnames/bind";
import { Outlet } from "react-router-dom";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import { createContext, useState } from "react";
import { useGetContext } from "../../hooks/useGetContext";
import chatbox from "../../images/chat-box.gif";

const cx = classNames.bind(styles);

export const createCartItemQuantContext = createContext();

export const useCartItemQuantContext = () => {
  return useGetContext(createCartItemQuantContext);
};

function CommonLayout() {
  const [cartItemQuant, setCartItemQuant] = useState(0);
  const [show, setShow] = useState(false);
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
        <div className={cx("chat-box")}>
          <div className={cx("chat-box-img")}>
            <img src={chatbox} onClick={() => setShow(!show)} />
          </div>
          <div className={cx("chat-box-ai", { show: show })}>
            <iframe
              allow="microphone;"
              width="350"
              height="430"
              src="https://console.dialogflow.com/api-client/demo/embedded/f112c6d5-2f25-4e9f-b194-b07e25511982"
            ></iframe>
          </div>
        </div>
      </div>
    </createCartItemQuantContext.Provider>
  );
}

export default CommonLayout;

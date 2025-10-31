import styles from "./CommonLayout.module.scss";
import classNames from "classnames/bind";
import { Outlet } from "react-router-dom";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import { createContext, useEffect, useState } from "react";
import { useGetContext } from "../../hooks/useGetContext";
import chatbotIcon from "../../images/Chatbot.gif";
import Chatbot from "../../Component/Chatbot/Chatbot";
import { chatService } from "../../Component/Chatbot/chatService";

const cx = classNames.bind(styles);

export const createCartItemQuantContext = createContext();

export const useCartItemQuantContext = () => {
  return useGetContext(createCartItemQuantContext);
};

function CommonLayout() {
  const [cartItemQuant, setCartItemQuant] = useState(0);
  const [show, setShow] = useState(false);

  const initChat = async () => {
    try {
      const response = await chatService.initializeChatSession();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   initChat();
  // }, []);

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
          <button
            className={cx("chat-box-icon", { show: show })}
            onClick={() => setShow(!show)}
          >
            <img src={chatbotIcon} />
          </button>
          <Chatbot show={show} />
        </div>
      </div>
    </createCartItemQuantContext.Provider>
  );
}

export default CommonLayout;

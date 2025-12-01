import { useState, useRef, useEffect } from "react";
import styles from "./ChatStyles.module.scss";
import classNames from "classnames/bind";
import { chatService } from "./chatService";
import productService from "../../api/productService";
import { formatNumber } from "../../utils/formatNumber";
import { useNavigate } from "react-router";
import orderService from "../../api/orderService";
import authService from "../../api/authService";

const cx = classNames.bind(styles);

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "bot",
    response: "Chào mừng! Hãy nhập tin nhắn để bắt đầu 🥳🥳",
    type: "text",
  },
];

const lookupColor = {
  pending: "#f0d821",
  preparing: "#eb8c1b",
  shipping: "#2880ea",
  completed: "#1bb052",
  cancel: "#fe6347",
};

function decodeHtmlEntities(text) {
  if (!text) return "";
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const Chatbot = ({ show }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isLoading]);

  const appendMessage = (response, sender, type = "text") => {
    setMessages((prev) => [
      ...prev,
      { response, sender, id: Date.now() + Math.random(), type },
    ]);
  };

  const fetchProduct = async (category, option, brand) => {
    try {
      const res = await productService.chatbotSearchProductAsking(
        category,
        option,
        brand
      );

      appendMessage(res.data.message, "bot", "text");
      appendMessage(res.data.product, "bot", "product");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrder = async (orderStatus) => {
    try {
      const res = await orderService.chatbotAskingOrder(orderStatus);

      appendMessage(res.data, "bot", "order");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async (e) => {
    const holdMess = "Xin đợi, chúng tôi đang tìm phân tích yêu cầu của bạn 🫡🫡";
    if (e) e.preventDefault();
    const text = userInput
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

    if (!text || isLoading) return;

    appendMessage(userInput.trim(), "user");
    appendMessage(holdMess, "bot");
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(text);

      const botResponses = response.data.responses;

      if (botResponses && botResponses.length > 0) {
        botResponses.forEach((item) => {
          if (item.type === "text" && item.text) {
            const rawText = item.text;
            const startProductTag = "<<JSON_PRODUCT_PAYLOAD_START>>";
            const endProductTag = "<<JSON_PRODUCT_PAYLOAD_END>>";
            const startOrderTag = "<<JSON_ORDER_PAYLOAD_START>>";
            const endOrderTag = "<<JSON_ORDER_PAYLOAD_END>>";

            if (
              rawText.includes(startProductTag) &&
              rawText.includes(endProductTag)
            ) {
              const startIndex =
                rawText.indexOf(startProductTag) + startProductTag.length;
              const endIndex = rawText.indexOf(endProductTag);
              const jsonString = rawText.substring(startIndex, endIndex).trim();

              const extractedEntities = JSON.parse(
                decodeHtmlEntities(jsonString)
              );

              const entityMap = extractedEntities.reduce((map, item) => {
                map[item.name] = item.value;
                return map;
              }, {});

              const category = entityMap["@product"] ?? null;
              const optionValue = entityMap["@option"] ?? null;
              const brand = entityMap["@brand"] ?? null;

              fetchProduct(category, optionValue, brand);
            } else if (
              rawText.includes(startOrderTag) &&
              rawText.includes(endOrderTag)
            ) {
              const startIndex =
                rawText.indexOf(startOrderTag) + startOrderTag.length;
              const endIndex = rawText.indexOf(endOrderTag);
              const jsonString = rawText.substring(startIndex, endIndex).trim();

              const extractedEntities = JSON.parse(
                decodeHtmlEntities(jsonString)
              );

              const orderStatus = extractedEntities.reduce(
                (accumulator, currentItem) => {
                  if (accumulator === "") {
                    return currentItem.name.split("_").pop();
                  }
                  return accumulator + "," + currentItem.name.split("_").pop();
                },
                ""
              );

              fetchOrder(orderStatus);
            } else {
              appendMessage(rawText, "bot");
            }
          }
        });
      }
    } catch (error) {
      const errorText = `Đã có lỗi gì đó, bạn nhắn lại giúp bot với 🥺🥺`;

      appendMessage(errorText, "bot");
    } finally {
      setIsLoading(false);
    }
  };

  const textMessage = (msg) => (
    <div key={msg.id} className={cx("message-container", `${msg.sender}`)}>
      <p className={cx("chat-message", `${msg.sender}-message`)}>
        {msg.response}
      </p>
    </div>
  );

  const productMessage = (msg) => (
    <div key={msg.id} className={cx("message-container", `${msg.sender}`)}>
      <div
        className={cx("chat-message", `${msg.sender}-message`, "product-array")}
      >
        <div className={cx("product-wrapper")}>
          {msg.response.map((product, id) => {
            return (
              <div
                key={id}
                className={cx("product-container")}
                onClick={() =>
                  navigate(
                    `/product/${product.product.product_id}/variant/${product.variant_id}`
                  )
                }
              >
                <div className={cx("product-variant")}>
                  <div className={cx("variant-img")}>
                    <img src={product.image_url} />
                  </div>
                  <div className={cx("variant-main")}>
                    <span className={cx("variant-name")}>
                      {product.variant_name}
                    </span>
                    <div className={cx("variant-sold")}>
                      <span>{formatNumber(parseInt(product.price))}đ</span>
                      <span>{product.product.sale_volume}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const toOrder = authService.getCurrentUser ? "/customer/order" : "/order";

  const orderMessage = (msg) => (
    <div key={msg.id} className={cx("message-container", `${msg.sender}`)}>
      <div
        className={cx(
          "chat-message",
          `${msg.sender}-message`,
          "order-status-array"
        )}
      >
        <h3 className={cx("order-title")}>Đơn hàng</h3>
        <div className={cx("order-status-container")}>
          {msg.response.map((order, id) => {
            return (
              <div
                className={cx("order-status-item")}
                key={id}
                style={{ background: lookupColor[order.order_status] }}
                onClick={() =>
                  navigate(toOrder, {
                    state: order.order_status,
                  })
                }
              >
                <span className={cx("status-name")}>{order.order_status}</span>
                <span className={cx("status-count")}>{order.count} đơn</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMessage = (msg) => {
    if (msg.type === "text") {
      return textMessage(msg);
    } else if (msg.type === "product") {
      return productMessage(msg);
    } else if (msg.type === "order") {
      return orderMessage(msg);
    }
  };

  return (
    <div className={cx("chat-container", { show: show })}>
      <div className={cx("chat-window")} ref={chatWindowRef}>
        {messages.map(renderMessage)}

        {isLoading && (
          <div className={cx("loading-message")}>
            <div className={cx("spinner")}></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className={cx("input-container")}>
        <button
          type="submit"
          className={cx("send-button")}
          disabled={isLoading || !userInput.trim()}
        >
          ➤
        </button>
        <input
          type="text"
          className={cx("user-input")}
          placeholder="Nhập tin nhắn tại đây..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isLoading}
          ref={inputRef}
          id="user-input"
        />
        <div style={{ width: "40px" }}></div>
      </form>
    </div>
  );
};

export default Chatbot;

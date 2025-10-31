import { useState, useRef, useEffect } from "react";
import styles from "./ChatStyles.module.scss";
import classNames from "classnames/bind";
import { chatService } from "./chatService";

const cx = classNames.bind(styles);

const INITIAL_MESSAGES = [
  { text: "Chào mừng! Hãy nhập tin nhắn để bắt đầu.", sender: "bot", id: 1 },
];

function decodeHtmlEntities(text) {
  if (!text) return "";
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const Chatbot = ({ show }) => {
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

  const appendMessage = (text, sender) => {
    setMessages((prev) => [
      ...prev,
      { text, sender, id: Date.now() + Math.random() },
    ]);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = userInput
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

    if (!text || isLoading) return;

    appendMessage(userInput.trim(), "user");
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(text);

      const botResponses = response.data.responses;

      if (botResponses && botResponses.length > 0) {
        botResponses.forEach((item) => {
          if (item.type === "text" && item.text) {
            const rawText = item.text;
            const startTag = "<<JSON_PAYLOAD_START>>";
            const endTag = "<<JSON_PAYLOAD_END>>";

            if (rawText.includes(startTag) && rawText.includes(endTag)) {
              const startIndex = rawText.indexOf(startTag) + startTag.length;
              const endIndex = rawText.indexOf(endTag);
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

              console.log(entityMap);
              console.log(category, optionValue, brand);
            } else {
              appendMessage(rawText, "bot");
            }
          }
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi/nhận tin nhắn:", error);

      const status = error.response ? error.response.status : "Mạng";
      const errorText = `Lỗi API (${status}). Vui lòng kiểm tra console.`;

      appendMessage(errorText, "bot");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (msg) => (
    <div key={msg.id} className={cx("message-container", `${msg.sender}`)}>
      <p className={cx("chat-message", `${msg.sender}-message`)}>{msg.text}</p>
    </div>
  );

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
        />
        {/* <div className={cx("chatbot-icon")}>
          <img src={chatbot} />
        </div> */}
      </form>
    </div>
  );
};

export default Chatbot;

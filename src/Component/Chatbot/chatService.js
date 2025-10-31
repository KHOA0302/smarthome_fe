import authService from "../../api/authService";
import chatbotApi from "./ChatApi";
import { v4 as uuid } from "uuid";

const userId =
  authService.getCurrentUser() || authService.getGuestId() || uuid();

export const chatService = {
  initializeChatSession: () => {
    return chatbotApi.post(`/${userId}`, {
      type: "text",
      text: "notfuckingthing",
    });
  },
  sendMessage: (text) => {
    return chatbotApi.post(`/${userId}`, {
      type: "text",
      text: text,
    });
  },
};

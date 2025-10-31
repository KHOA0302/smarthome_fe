import axios from "axios";
import { CHATBOT_CONFIG } from "./chatbotConfig";

const chatbotApi = axios.create({
  baseURL: `${CHATBOT_CONFIG.HOST}/api/v1/bots/${CHATBOT_CONFIG.BOT_ID}/converse`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CHATBOT_CONFIG.TOKEN}`,
  },
  timeout: 10000,
});

export default chatbotApi;

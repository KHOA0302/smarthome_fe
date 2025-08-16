import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      localStorage.removeItem("guest_session_id");
    } else {
      let guestSessionId = localStorage.getItem("guest_session_id");

      if (!guestSessionId) {
        guestSessionId = uuidv4();
        localStorage.setItem("guest_session_id", guestSessionId);
      }
      config.headers["X-Session-ID"] = guestSessionId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("jwt_token");

      alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!!!");
      window.location.href = "/login";

      return Promise.reject(
        error || "Phiên làm việc đã hết hạn hoặc không có quyền."
      );
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

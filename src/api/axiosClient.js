import axios from "axios";

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
      console.error(
        "Lỗi xác thực hoặc phân quyền:",
        error.response.data.message
      );

      localStorage.removeItem("jwt_token");
      window.location.href = "/login";

      alert(
        "Phiên làm việc của bạn đã hết hạn hoặc không có quyền. Vui lòng đăng nhập lại."
      );

      return Promise.reject(
        new Error("Phiên làm việc đã hết hạn hoặc không có quyền.")
      );
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

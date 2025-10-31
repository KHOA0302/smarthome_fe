import axiosClient from "./axiosClient";

const authService = {
  login: (username, password) => {
    return axiosClient.post("/auth/login", { username, password });
  },

  register: (userData) => {
    return axiosClient.post("/auth/register", userData);
  },

  logout: () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_info");
    return Promise.resolve(true);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("jwt_token");
  },

  getCurrentUser: () => {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  },

  getGuestId: () => {
    return localStorage.getItem("guest_session_id");
  },

  getUserInfo: () => {
    return axiosClient.get("/auth/user-info");
  },

  googleSign: (token) => {
    return axiosClient.post("/auth/google", { token });
  },

  editUserinfo: (userEdited) => {
    return axiosClient.put("/auth/edit-info", { userEdited });
  },
};

export default authService;

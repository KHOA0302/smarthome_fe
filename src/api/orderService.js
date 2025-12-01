import axiosClient from "./axiosClient";

const orderService = {
  createOrder: (data, guestInfo) => {
    return axiosClient.post("/order/create-order", { ...data, guestInfo });
  },
  getOrderAdmin: (status) => {
    return axiosClient.post("/order/get-order-admin", { status });
  },
  getOrderCustomer: (status) => {
    return axiosClient.post("/order/get-order-customer", { status });
  },
  getOrderQuarterlyRevenue: () => {
    return axiosClient.get("/order/get-quarterly-revenue");
  },
  chatbotAskingOrder: (orderStatus) => {
    return axiosClient.get(`/order/chatbot-asking-order?status=${orderStatus}`);
  },
  editOrderStatus: (orderId, status) => {
    return axiosClient.put("/order/edit-order-status", { orderId, status });
  },
};

export default orderService;

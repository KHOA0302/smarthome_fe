import axiosClient from "./axiosClient";

const orderService = {
  createOrder: (data) => {
    return axiosClient.post("/order/create-order", data);
  },
  getOrderAdmin: (orderStatus) => {
    return axiosClient.post("/order/get-order-admin", { orderStatus });
  },
  getOrderQuarterlyRevenue: () => {
    return axiosClient.get("/order/get-quarterly-revenue");
  },
};

export default orderService;

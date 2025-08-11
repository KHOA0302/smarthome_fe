import axiosClient from "./axiosClient";

const orderService = {
  createOrder: (data) => {
    return axiosClient.post("/order/create-order", data);
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
  editOrderStatus: (orderId, status) => {
    return axiosClient.put("/order/edit-order-status", { orderId, status });
  },
};

export default orderService;

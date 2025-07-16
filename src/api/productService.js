import axiosClient from "./axiosClient";

const productService = {
  createProduct: (data) => {
    return axiosClient.post("/product/add", data);
  },
};

export default productService;

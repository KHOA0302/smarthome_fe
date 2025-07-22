import axiosClient from "./axiosClient";

const productService = {
  createProduct: (data) => {
    return axiosClient.post("/product/add", data);
  },
  getProductDetails: (product_id, variant_id) => {
    return axiosClient.get(`/product/${product_id}/variant/${variant_id}`);
  },
};

export default productService;

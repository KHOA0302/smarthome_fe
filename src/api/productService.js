import axiosClient from "./axiosClient";

const productService = {
  createProduct: (data) => {
    return axiosClient.post("/product/add", data);
  },

  getProductVariantDetails: (product_id, variant_id) => {
    return axiosClient.get(`/product/${product_id}/variant/${variant_id}`);
  },

  getProductDetails: (productId) => {
    return axiosClient.post("/product/details", { productId });
  },

  getAllProducts: () => {
    return axiosClient.get("/product/all");
  },

  editProductImgs: (productId, productImgs) => {
    return axiosClient.post("/product/edit-imgs", { productId, productImgs });
  },

  editVariants: (productId, variants) => {
    return axiosClient.post("/product/edit-variants", { productId, variants });
  },
};

export default productService;

import axiosClient from "./axiosClient";

const productService = {
  createProduct: (data) => {
    return axiosClient.post("/product/add", data);
  },

  getProductVariantDetails: (product_id, variant_id) => {
    return axiosClient.get(`/product/${product_id}/variant/${variant_id}`);
  },

  getProductDetails: (productId) => {
    return axiosClient.get(`/product/details/${productId}`);
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

  editService: (productId, servicePackages) => {
    return axiosClient.put("/product/edit-service", {
      productId,
      servicePackages,
    });
  },

  editSpecifications: (productId, attributeGroups) => {
    return axiosClient.put("/product/edit-specifications", {
      productId,
      attributeGroups,
    });
  },

  getTopSale: (limit) => {
    return axiosClient.get(`/product/get-top-sale/${limit}`);
  },

  getLatest: (limit) => {
    return axiosClient.get(`/product/get-latest-product/${limit}`);
  },
};

export default productService;

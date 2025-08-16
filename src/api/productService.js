import axios from "axios";
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

  getAllProductsByFilter: ({ brandId, categoryId }) => {
    return axiosClient.post("/product/all", { brandId, categoryId });
  },

  editProductInfo: (productInfo) => {
    return axiosClient.put("/product/edit-product-info", { productInfo });
  },

  editProductImgs: (productId, productImgs) => {
    return axiosClient.put("/product/edit-imgs", { productId, productImgs });
  },

  editVariants: (productId, variants) => {
    return axiosClient.post("/product/edit-variants", { productId, variants });
  },

  editService: (servicePackages) => {
    return axiosClient.put("/product/edit-service", {
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

  getProductByFilter: ({ categoryId, brandId }) => {
    return axiosClient.post("/product/get-product-by-filter", {
      categoryId,
      brandId,
    });
  },

  searchTopProduct: (keyword) => {
    return axiosClient.get(`product/search?keyword=${keyword}`);
  },
};

export default productService;

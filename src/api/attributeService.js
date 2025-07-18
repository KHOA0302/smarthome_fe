import axiosClient from "./axiosClient";

const attributeService = {
  getAttributeByCategory: (categoryId) => {
    return axiosClient.post("/attribute/filter", { categoryId });
  },
};

export { attributeService };

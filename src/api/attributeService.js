import axiosClient from "./axiosClient";

const attributeService = {
  getAttributeByCategory: (categoryId) => {
    return axiosClient.post("/attribute/filter", { categoryId });
  },

  createGroup: (categoryId, groups) => {
    return axiosClient.post("/attribute/create-group", { categoryId, groups });
  },
};

export { attributeService };

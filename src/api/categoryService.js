import axiosClient from "./axiosClient";

const categoryService = {
  getAllCategories: () => {
    return axiosClient.get("/category/all-categories");
  },
};

export { categoryService };

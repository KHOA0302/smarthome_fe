import axiosClient from "./axiosClient";

const categoryService = {
  getAllCategories: () => {
    return axiosClient.get("/category/all-categories");
  },
  createCategory: (data) => {
    return axiosClient.post("/category/create-category", data);
  },
  editCategory: (newCategory) => {
    return axiosClient.put("/category/edit-category", { newCategory });
  },
};

export { categoryService };

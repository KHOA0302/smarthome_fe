import axiosClient from "./axiosClient";

const optionService = {
  getOptionFilter: (category_id, is_filterable = undefined) => {
    return axiosClient.post("/option/filter", { category_id, is_filterable });
  },
};

export { optionService };

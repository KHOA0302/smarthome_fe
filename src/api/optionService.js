import axiosClient from "./axiosClient";

const optionService = {
  getOptionFilter: (category_id, is_filterable = undefined) => {
    return axiosClient.post("/option/filter", { category_id, is_filterable });
  },

  createOption: (categoryId, optionValue) => {
    return axiosClient.post("/option/create-option", {
      categoryId,
      optionName: optionValue.name,
      isFilterable: optionValue.isFilter,
    });
  },

  editOption: ({ option_id, option_name }) => {
    return axiosClient.post("/option/update", {
      option_id,
      option_name,
    });
  },
};

export { optionService };

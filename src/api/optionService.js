import axiosClient from "./axiosClient";

const optionService = {
  getOptionFilter: (category_id, is_filterable = undefined) => {
    return axiosClient.post("/option/filter", { category_id, is_filterable });
  },

  createOption: (categoryId, optionValue) => {
    console.log(optionValue);
    return axiosClient.post("/option/create-option", {
      categoryId,
      optionName: optionValue.name,
      isFilterable: optionValue.isFilter,
    });
  },
};

export { optionService };

import axiosClient from "./axiosClient";

const serviceService = {
  getServiceFilter: (category_id) => {
    return axiosClient.post("/service-package/filter", { category_id });
  },

  createService: (categoryId, serviceName) => {
    return axiosClient.post("/service-package/create-service", {
      categoryId,
      serviceName,
    });
  },
};

export { serviceService };

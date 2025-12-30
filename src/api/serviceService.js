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

  editService: ({ service_id, service_name }) => {
    return axiosClient.post("/service-package/update", {
      service_id,
      service_name,
    });
  },
};

export { serviceService };

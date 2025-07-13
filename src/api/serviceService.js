import axiosClient from "./axiosClient";

const serviceService = {
  getServiceFilter: (category_id) => {
    return axiosClient.post("/service-package/filter", { category_id });
  },
};

export { serviceService };

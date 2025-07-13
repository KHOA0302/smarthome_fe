import axiosClient from "./axiosClient";

const brandService = {
  getAllBrands: () => {
    return axiosClient.get("/brand/all-brands");
  },
};

export { brandService };

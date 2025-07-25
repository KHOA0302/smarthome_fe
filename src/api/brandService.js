import axiosClient from "./axiosClient";

const brandService = {
  getAllBrands: () => {
    return axiosClient.get("/brand/all-brands");
  },

  createBrand: (data) => {
    return axiosClient.post("/brand/create-brand", data);
  },
};

export { brandService };

import axiosClient from "./axiosClient";

const promotionService = {
  createPromotion: ({ promotion, promotionVariants }) => {
    return axiosClient.post("/promotion/create-promotion", {
      promotion,
      promotionVariants,
    });
  },
  getPromotion: () => {
    return axiosClient.get("/promotion/get-promotion ");
  },
  deletePromotion: (promotionId) => {
    return axiosClient.delete(`/promotion/delete-promotion/${promotionId}`);
  },
};

export { promotionService };

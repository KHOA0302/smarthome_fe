import axiosClient from "./axiosClient";

const reviewService = {
  createReview: (reviewsData) => {
    return axiosClient.post("/review/create-review", { reviewsData });
  },
  getReviews: (productId) => {
    return axiosClient.get(`/review/get-reviews?productId=${productId}`);
  },
};

export { reviewService };

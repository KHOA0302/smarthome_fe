import axiosClient from "./axiosClient";

const reviewService = {
  createReview: (reviewsData) => {
    return axiosClient.post("/review/create-review", { reviewsData });
  },
};

export { reviewService };

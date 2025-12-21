import axiosClient from "./axiosClient";

const notificationService = {
  getNotificationAlert: () => {
    return axiosClient.get("/notification/get-notification-alert");
  },
};

export { notificationService };

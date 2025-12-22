import axiosClient from "./axiosClient";

const notificationService = {
  getNotificationAlert: () => {
    return axiosClient.get("/notification/get-notification-alert");
  },
  deleteNotification: (notificationId) => {
    return axiosClient.delete(
      `/notification/delete-notification/${notificationId}`
    );
  },
};

export { notificationService };

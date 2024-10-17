import { notification } from "antd";

const editNotification = () => {
  notification.warning({
    message: "Semester Not Available",
    description: `You cannot edit the past semester!`,
    placement: "topRight",
  });
};

const deleteNotification = () => {
  notification.warning({
    message: "Semester Not Available",
    description: `You cannot delete the past semester!`,
    placement: "topRight",
  });
};

export { editNotification, deleteNotification };

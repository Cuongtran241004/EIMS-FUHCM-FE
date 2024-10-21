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

const checkInNotification = () => {
  notification.info({
    type: "info",
    message: "You can only check-in 30 minutes before the exam starts",
  });
};

const checkOutNotification = () => {
  notification.info({
    type: "info",
    message: "You can only check-out after the exam ends",
  });
};

export {
  editNotification,
  deleteNotification,
  checkInNotification,
  checkOutNotification,
};

import { notification } from "antd";

const editNotification = () => {
  notification.warning({
    message: "Warning",
    description: `You cannot edit the exam slot!`,
    placement: "topRight",
  });
};

const deleteNotification = () => {
  notification.warning({
    message: "Warning",
    description: `You cannot delete the exam slot!`,
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

const assignmentNotification = () => {
  notification.info({
    message: "Information",
    description: "You cannot assign when invigilators are not enough",
  });
};

const requestNotification = () => {
  notification.warning({
    message: "Warning",
    description: "This request has been processed",
  });
};
export {
  editNotification,
  deleteNotification,
  checkInNotification,
  checkOutNotification,
  assignmentNotification,
  requestNotification,
};

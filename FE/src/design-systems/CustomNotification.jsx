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

const checkInNotificationStart = (time) => {
  notification.info({
    type: "info",
    message: `You can only check-in ${time} minutes before the exam starts`,
  });
};
const checkInNotificationEnd = () => {
  notification.info({
    type: "info",
    message: `You can only check-in before the exam ends`,
  });
};
const checkOutNotificationStart = () => {
  notification.info({
    type: "info",
    message: "You can only check-out after the exam ends",
  });
};
const checkOutNotificationEnd = (time) => {
  notification.info({
    type: "info",
    message: `You can only check-out ${time} minutes after the exam ends`,
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

const alreadyAssignmentNotification = () => {
  notification.warning({
    message: "Warning",
    description: `This exam slot has already been assigned!`,
    placement: "topRight",
  });
};
export {
  editNotification,
  deleteNotification,
  checkInNotificationStart,
  checkInNotificationEnd,
  checkOutNotificationStart,
  checkOutNotificationEnd,
  assignmentNotification,
  requestNotification,
  alreadyAssignmentNotification,
};

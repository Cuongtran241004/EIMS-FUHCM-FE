import { notification } from "antd";

const editNotification = () => {
  notification.warning({
    message: "Semester Not Available",
    description: `The selected semester is not available for editing.`,
    placement: "topRight",
  });
};

const deleteNotification = () => {
  notification.warning({
    message: "Semester Not Available",
    description: `The selected semester is not available for deleting.`,
    placement: "topRight",
  });
};

export { editNotification, deleteNotification };

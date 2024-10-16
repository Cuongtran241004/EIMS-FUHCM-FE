import { Tag } from "antd";

const examScheduleTag = (status) => {
  let color = "";
  let text = "";
  // Define color and label based on the status value
  switch (status) {
    case "NEEDS_ROOM_ASSIGNMENT":
      color = "blue";
      text = "Needs room";
      break;
    case "PENDING":
      color = "orange";
      text = "Pending";
      break;
    case "APPROVED":
      color = "green";
      text = "Approved";
      break;
    case "REJECTED":
      color = "red";
      text = "Rejected";
      break;
    default:
      color = "black";
      text = "Unknown";
  }

  return (
    <Tag color={color}>
      <strong>{text}</strong>
    </Tag>
  );
};

const userRoleTag = (role) => {
  let color = "";
  let text = "";
  // Define color and label based on the role value
  switch (role) {
    case "Manager":
      color = "orange";
      text = "Manager";
      break;
    case "Staff":
      color = "blue";
      text = "Staff";
      break;
    case "Invigilator":
      color = "green";
      text = "Invigilator";
      break;
    default:
      color = "gray";
      text = "Unknown";
  }

  return (
    <Tag color={color}>
      <strong>{text}</strong>
    </Tag>
  );
};

const examTypeTag = (type) => {
  let color = "";
  // Define color based on the type value
  switch (type) {
    case "PE":
      color = "blue";
      break;
    case "FE":
      color = "green";
      break;
    case "PE&TE":
      color = "orange";
      break;
    default:
      color = "red";
  }

  return (
    <Tag color={color}>
      <strong>{type}</strong>
    </Tag>
  );
};

const requestTag = (status) => {
  let color = "";
  let text = "";
  // Define color and label based on the status value
  switch (status) {
    case "PENDING":
      color = "orange";
      text = "Pending";
      break;
    case "APPROVED":
      color = "green";
      text = "Approved";
      break;
    case "REJECTED":
      color = "red";
      text = "Rejected";
      break;
    default:
      color = "gray";
      text = "Unknown";
  }

  return (
    <Tag color={color}>
      <strong>{text}</strong>
    </Tag>
  );
};
export { examScheduleTag, userRoleTag, examTypeTag, requestTag };

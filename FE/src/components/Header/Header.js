import { PieChartOutlined } from "@ant-design/icons";
import {
  MANAGER_DASHBOARD_URL,
  MANAGER_REQUESTS_URL,
  STAFF_ATTENDANCE_URL,
  STAFF_EXAM_SCHEDULE_URL,
  STAFF_EXAM_URL,
  STAFF_SUBJECT_URL,
} from "../../configs/urlWeb";

const headerConfig = {
  manager: [
    {
      name: "Dashboard",
      path: MANAGER_DASHBOARD_URL,
    },
    { name: "Request", path: MANAGER_REQUESTS_URL },
  ],
  staff: [
    { name: "Subject", path: STAFF_SUBJECT_URL },
    { name: "Exam", path: STAFF_EXAM_URL },
    { name: "Exam Schedule", path: STAFF_EXAM_SCHEDULE_URL },
    { name: "Attendance", path: STAFF_ATTENDANCE_URL },
  ],
  invigilator: [
    { name: "Dashboard", path: "/" },
    { name: "Register", path: "/register" },
    {
      name: "Request",
      subMenu: [
        { name: "Send request", path: "/request/send" },
        { name: "View requests", path: "/request/view" },
      ],
    },
  ],
};

export default headerConfig;

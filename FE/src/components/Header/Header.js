import { PieChartOutlined } from "@ant-design/icons";
import {
  MANAGER_DASHBOARD_URL,
  MANAGER_REQUESTS_URL,
  STAFF_ASSIGNMENT_URL,
  STAFF_ATTENDANCE_URL,
  STAFF_EXAM_SCHEDULE_URL,
  STAFF_EXAM_URL,
  STAFF_SUBJECT_URL,
} from "../../configs/urlWeb";

const headerConfig = {
  1: [
    {
      name: "Dashboard",
      path: MANAGER_DASHBOARD_URL,
    },
    { name: "Request", path: MANAGER_REQUESTS_URL },
  ],
  2: [
    { name: "Subject", path: STAFF_SUBJECT_URL },
    { name: "Exam", path: STAFF_EXAM_URL },
    { name: "Exam Schedule", path: STAFF_EXAM_SCHEDULE_URL },
    { name: "Assignment", path: STAFF_ASSIGNMENT_URL },
    { name: "Attendance", path: STAFF_ATTENDANCE_URL },
  ],
  3: [
    { name: "Home", path: "/" },
    { name: "Register", path: "/register" },

    { name: "Report", path: "/report" },
    { name: "Attendance", path: "/attendance" },
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

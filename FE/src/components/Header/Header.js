import {
  MANAGER_DASHBOARD_URL,
  MANAGER_REQUESTS_URL,
  STAFF_ATTENDANCE_URL,
  STAFF_EXAM_SCHEDULE_URL,
  STAFF_EXAM_URL,
  STAFF_SUBJECT_URL,
} from "../../configs/urlWeb";

const headerConfig = {
  Manager: [
    { name: "Dashboard", path: MANAGER_DASHBOARD_URL },
    { name: "Request", path: MANAGER_REQUESTS_URL },
  ],
  Staff: [
    { name: "Subject", path: STAFF_SUBJECT_URL },
    { name: "Exam", path: STAFF_EXAM_URL },
    { name: "Exam Schedule", path: STAFF_EXAM_SCHEDULE_URL },
    { name: "Attendance", path: STAFF_ATTENDANCE_URL },
  ],
  Invigilator: [
    { name: "Schedule", path: "/dashboard" },
    { name: "Register", path: "/register" },
    { name: "request", path: "/request" },
  ],
};

export default headerConfig;

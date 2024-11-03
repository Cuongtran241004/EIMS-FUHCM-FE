const headerConfig = {
    manager: [
      { name: "Dashboard", path: "/" },
      { name: "Semester", path: "/semester" },
      { name: "Staffs", path: "/staffs" },
      { name: "Invigilators", path: "/invigilators" },
      { name: "Exam Slot", path: "/exam-slot" },
    ],
    staff: [
      { name: "Subject", path: "/" },
      { name: "Exam", path: "/exam" },
      { name: "Exam Schedule", path: "/exam-schedule" },
      { name: "Attendance", path: "/attendance" },
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
  


const headerConfig = {

    Manager: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Request", path: "/requests" },
    ],
    Staff: [
        { name: "Subject", path: "/subject" },
        { name: "Exam", path: "/exam" },
        { name: "Exam Schedule", path: "/exam-schedule" },
        { name: "Attendance", path: "/attendance" },
    ],
    Invigilator: [
        { name: "Schedule", path: "/dashboard" },
        { name: "Register", path: "/register" },
        { name: "request", path: "/request" },
    ],
    Admin: [
        { name: "Dashboard", path: "/" },
        { name: "Register", path: "/register" },
        { name: "Exam Slot", path: "/exam-slot" },
        { name: "Requests", path: "/requests" },
        { name: "Exam Schedule", path: "/exam-schedule" },
    ]
}

export default headerConfig;
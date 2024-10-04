

const headerConfig = {

    manager: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Request", path: "/requests" },
    ],
    staff: [
        { name: "Subject", path: "/subject" },
        { name: "Exam", path: "/exam" },
        { name: "Exam Schedule", path: "/exam-schedule" },
        { name: "Attendance", path: "/attendance" },
    ],
    invigilator: [
        { name: "Schedule", path: "/dashboard" },
        { name: "Register", path: "/register" },
        { name: "request", path: "/request" },
    ],
}

export default headerConfig;
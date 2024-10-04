

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
    Admin: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Semester", path: "/semester" },
        { name: "Subject", path: "/subjects" },
        { name: "Staff", path: "/staffs" },
        { name: "Invigilator", path: "/invigilators" },
        { name: "Exam Slot", path: "/exam-slot" },
        { name: "Requests", path: "/requests" },
        { name: "Exam Schedule", path: "/exam-schedule" },
    ]
}

export default headerConfig;
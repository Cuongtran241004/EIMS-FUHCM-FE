import { Button, Popconfirm, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { examScheduleTag, examTypeTag, userRoleTag } from "./CustomTag.jsx";
import { roleOptions } from "../configs/data.js";

const examScheduleTable = (handleRoomClick, handleEdit, handleDelete) => [
  {
    title: "Code",
    dataIndex: "subjectCode",
    key: "subjectCode",
    align: "center",
    width: "10%",
  },
  {
    title: "Subject",
    dataIndex: "subjectName",
    key: "subjectName",
    width: "20%",
  },
  {
    title: "Exam Type",
    dataIndex: "examType",
    key: "examType",
    align: "center",
    width: "10%",
    render: (text) => examTypeTag(text),
  },
  {
    title: "Date",
    dataIndex: "startAt", // Use startAt to extract date
    key: "date",
    align: "center",
    width: "10%",
    render: (text) => moment(text).format("DD/MM/YYYY"), // Format as DD-MM-YYYY
  },
  {
    title: "Time",
    key: "time",
    align: "center",
    width: "15%",
    render: (text, record) => {
      const startTime = new Date(record.startAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = new Date(record.endAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${startTime} - ${endTime}`; // Combine start and end time
    },
  },
  {
    title: "Number of Students",
    dataIndex: "numberOfStudents",
    key: "numberOfStudents",
    align: "center",
    width: "10%",
  },
  {
    title: "Room",
    key: "room",
    align: "center",
    render: (text, record) => (
      <Button type="text" onClick={() => handleRoomClick(record.id)}>
        <PlusSquareOutlined style={{ fontSize: "20px", color: "#43AA8B" }} />
      </Button>
    ),
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "10%",
    render: (status) => examScheduleTag(status),
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    render: (text, record) => (
      <Space size="large">
        <EditOutlined
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => handleEdit(record)}
        />
        <Popconfirm
          title="Are you sure to delete this exam slot?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
        </Popconfirm>
      </Space>
    ),
  },
];

const subjectTable = (currentPage, pageSize, handleEdit, handleDelete) => [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    align: "center",
    render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    align: "center",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    render: (text, record) => (
      <Space size="large">
        <EditOutlined
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => handleEdit(record)}
        />
        <Popconfirm
          title="Are you sure to delete this subject?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
        </Popconfirm>
      </Space>
    ),
  },
];

const userTable = (handleEdit, handleDelete) => [
  {
    title: "FUID",
    dataIndex: "fuId",
    key: "fuId",
  },
  {
    title: "Full Name",
    key: "fullName",
    render: (text, record) => `${record.lastName} ${record.firstName} `,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Department",
    dataIndex: "department",
    key: "department",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    // using tag of ant design to display role
    render: (text, record) => {
      const role = roleOptions.find((role) => role.value == record.role);

      return userRoleTag(role.label);
    },
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <Space size="large">
        <EditOutlined
          onClick={() => handleEdit(record)}
          style={{ color: "blue", cursor: "pointer" }}
        />
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => handleDelete(record.fuId)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
        </Popconfirm>
      </Space>
    ),
  },
];

export { examScheduleTable, subjectTable, userTable };

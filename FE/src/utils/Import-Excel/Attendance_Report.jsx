import * as XLSX from "xlsx";
import { Button } from "antd";
import { saveAs } from "file-saver";
import { DownloadOutlined } from "@ant-design/icons";

const exportToExcel = (data) => {
  // Flatten the data to have each exam slot on a new row
  const formattedData = data.flatMap((invigilator) =>
    invigilator.detail.map((detail) => ({
      "Invigilator ID": invigilator.fuId,
      Name: `${invigilator.lastName} ${invigilator.firstName}`,
      Email: invigilator.email,
      Phone: invigilator.phone,
      "Total Exam Slots": invigilator.totalSlots,
      "Total Hours": invigilator.totalHours,
      "Hourly Rate": invigilator.hourlyRate,
      "Calculated Fee": invigilator.fee,
      "Exam Slot Subject Code": detail.subjectCode,
      "Exam Slot Subject Name": detail.subjectName,
      "Exam Type": detail.examType,
      "Exam Date": detail.date,
      "Start Time": detail.startAt,
      "End Time": detail.endAt,
    }))
  );

  // Create a new workbook and add the data
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invigilation Report");

  // Generate Excel file and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(
    dataBlob,
    `Invigilation_Report_${new Date().toISOString().split("T")[0]}.xlsx`
  );
};

// Render your export button
const ReportExportButton = ({ data }) => (
  <Button
    type="primary"
    style={{ float: "right", backgroundColor: "#F9844A", color: "white" }}
    onClick={() => exportToExcel(data)}
  >
    <DownloadOutlined />
    Export Report
  </Button>
);

export default ReportExportButton;

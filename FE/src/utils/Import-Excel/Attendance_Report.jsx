import ExcelJS from "exceljs";
import { Button } from "antd";
import { saveAs } from "file-saver";
import { DownloadOutlined } from "@ant-design/icons";

const exportToExcel = (data) => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();

  // Create a worksheet for the invigilation report
  const worksheet = workbook.addWorksheet("Invigilation Report");

  // Define columns for the sheet (headers)
  worksheet.columns = [
    { header: "FuID", key: "fuId", width: 15 },
    { header: "Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 25 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Total Exam Slots", key: "totalSlots", width: 20 },
    { header: "Total Hours", key: "totalHours", width: 20 },
    { header: "Hourly Rate", key: "hourlyRate", width: 20 },
    { header: "Calculated Amounts", key: "fee", width: 20 },
    { header: "Subject Code", key: "subjectCode", width: 15 },
    { header: "Subject Name", key: "subjectName", width: 40 },
    { header: "Exam Type", key: "examType", width: 20 },
    { header: "Exam Date", key: "examDate", width: 15 },
    { header: "Start Time", key: "startTime", width: 15 },
    { header: "End Time", key: "endTime", width: 15 },
  ];

  // Flatten the data to have each exam slot on a new row
  const formattedData = data.flatMap((invigilator) => {
    // Check if the invigilator details are available
    if (invigilator.detail && invigilator.detail.length > 0) {
      return invigilator.detail.map((detail) => ({
        fuId: invigilator.fuId,
        name: `${invigilator.lastName} ${invigilator.firstName}`,
        email: invigilator.email,
        phone: invigilator.phone,
        totalSlots: invigilator.totalSlots,
        totalHours: invigilator.totalHours,
        hourlyRate: invigilator.hourlyRate,
        fee: invigilator.preCalculatedInvigilatorFree,
        subjectCode: detail.subjectCode,
        subjectName: detail.subjectName,
        examType: detail.examType,
        examDate: detail.date,
        startTime: detail.startAt,
        endTime: detail.endAt,
      }));
    }
    return []; // Return empty array if no details are present
  });

  // Add the formatted data rows to the worksheet
  formattedData.forEach((row) => {
    worksheet.addRow(row);
  });

  // Generate Excel file and trigger download
  workbook.xlsx.writeBuffer().then((buffer) => {
    const dataBlob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(
      dataBlob,
      `Invigilation_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  });
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

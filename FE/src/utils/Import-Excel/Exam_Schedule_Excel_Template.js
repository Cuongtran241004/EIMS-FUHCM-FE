import FileSaver from "file-saver";
import Excel from "exceljs";

// Function to create and download the Excel template
export const Exam_Schedule_Excel_Template = (listOfExam) => {
  // Initialize workbook and set metadata
  const workbook = new Excel.Workbook();
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();

  // Define the file name
  const fileName = "Exam_Schedule_Template";

  // Create two sheets: one for exam schedule input and one for exam IDs
  const examScheduleSheet = workbook.addWorksheet("Exam Schedule");
  const examIDSheet = workbook.addWorksheet("Exam");

  // Define columns for the "Exam Schedule" sheet (user input)
  examScheduleSheet.columns = [
    { header: "subjectExamId", key: "subjectExamId", width: 15 },
    { header: "date", key: "date", width: 25 },
    { header: "startTime", key: "startTime", width: 20 },
    { header: "endTime", key: "endTime", width: 20 },
    { header: "numberOfStudents", key: "numberOfStudents", width: 20 },
  ];

  // Add an example row for user input (blank row)
  examScheduleSheet.addRow({
    subjectExamId: "", // Empty cell to show dropdown
    date: "DD/MM/YYYY", // Placeholder for date format
    startTime: "HH:MM",
    endTime: "HH:MM",
    numberOfStudents: "",
  });

  // Define columns for the "Exam ID" sheet (rendering listOfExamSchedule data)
  examIDSheet.columns = [
    { header: "Exam Code", key: "id", width: 15 },
    { header: "Subject Code", key: "subjectCode", width: 20 },
    { header: "Subject Name", key: "subjectName", width: 45 },
    { header: "Exam Type", key: "examType", width: 20 },
  ];

  // Populate the "Exam ID" sheet with all exam information from listOfExam
  listOfExam.forEach((exam) => {
    examIDSheet.addRow({
      id: exam.id, // Exam code
      subjectCode: exam.subjectCode, // Subject code
      subjectName: exam.subjectName, // Subject name
      examType: exam.examType, // Exam type
    });
  });

  // Populate the "Exam Schedule" sheet with dropdown for Exam IDs (from "Exam ID" sheet)
  const rangeEnd = listOfExam.length + 1; // Dropdown range end row
  examScheduleSheet.getColumn("subjectExamId").eachCell((cell, rowNumber) => {
    // Skip the header row
    if (rowNumber > 1) {
      cell.dataValidation = {
        type: "list",
        formulae: [`'Exam'!$A$2:$A$${rangeEnd}`], // Dropdown from "Exam" sheet, starting at A2
        showErrorMessage: true,
        error: "Please select from the dropdown options.",
      };
    }
  });

  // Generate and save the Excel file
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  });
};

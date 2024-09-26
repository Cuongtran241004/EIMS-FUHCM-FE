// src/utils/createExcelTemplate.js
import * as XLSX from "xlsx";

// Function to create and download the Excel template
export const Invigilator_Excel_Template = () => {
  // Define the columns for the Excel template
  const worksheetData = [
    // Example row to guide users on what to enter
    { Name: "John Doe", Email: "johndoe@example.com", Phone: "1234567890" },
    { Name: "Jane Smith", Email: "janesmith@example.com", Phone: "123456789" },
  ];

  // Create a new workbook and a new worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invigilator Template");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, "Invigilator_Template.xlsx");
};

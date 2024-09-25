// src/utils/createExcelTemplate.js
import * as XLSX from "xlsx";

// Function to create and download the Excel template
export const ExcelTemplate = () => {
  // Define the columns for the Excel template
  const worksheetData = [
    // Example row to guide users on what to enter
    { Name: "John Doe", Email: "johndoe@example.com" },
    { Name: "Jane Smith", Email: "janesmith@example.com" },
  ];

  // Create a new workbook and a new worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Template");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, "Staff_Template.xlsx");
};

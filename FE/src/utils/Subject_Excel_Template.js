// src/utils/createExcelTemplate.js
import * as XLSX from "xlsx";

// Function to create and download the Excel template
export const Subject_Excel_Template = () => {
  // Define the columns for the Excel template
  const worksheetData = [
    {
      code: "SWP391", // Example FUID
      name: "Software Development Project", // Example first name
    },
  ];

  // Create a new workbook and a new worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, name);

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `Subject_Template.xlsx`);
};

// src/utils/createExcelTemplate.js
import * as XLSX from "xlsx";

// Function to create and download the Excel template
export const User_Excel_Template = () => {
  // Define the columns for the Excel template
  const worksheetData = [
    {
      fuId: "F123", // Example FUID
      firstName: "Nguyễn Văn", // Example first name
      lastName: "An", // Example last name
      email: "annv@fpt.edu.vn", // Example email
      phoneNumber: "0123456789", // Example phone number
      department: "IT", // Example department
      gender: "male", // Example gender
      role: "staff", // Example role
    },
  ];

  // Create a new workbook and a new worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, name);

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `User_Template.xlsx`);
};

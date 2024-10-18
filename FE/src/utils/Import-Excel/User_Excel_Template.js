import * as XLSX from "xlsx";

// Function to create and download the Excel template
export const User_Excel_Template = () => {
  // Define the columns for the Excel template
  const worksheetData = [
    {
      fuId: "F123", // Example FUID
      firstName: "An", // Example first name
      lastName: "Nguyễn Văn", // Example last name
      email: "annv@fpt.edu.vn", // Example email
      phoneNumber: "0123456789", // Example phone number
      department: "IT", // Example department (IT, Math, Eng)
      gender: "male", // Example gender (male, female)
      role: "staff", // Example role (manager, staff, invigilator)
    },
  ];

  // Create a new workbook and a new worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
    header: [
      "fuId",
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "department",
      "gender",
      "role",
    ],
    skipHeader: false, // Ensure headers are included
  });

  const workbook = XLSX.utils.book_new();

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "UserTemplate");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `User_Template.xlsx`);
};

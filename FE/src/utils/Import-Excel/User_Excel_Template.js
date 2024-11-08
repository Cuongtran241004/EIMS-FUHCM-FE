import FileSaver from "file-saver";
import Excel from "exceljs";

// Function to create and download the Excel template
export const User_Excel_Template = (
  listOfRole,
  listOfGenders,
  listOfDepartment
) => {
  // Initialize workbook and set metadata
  const workbook = new Excel.Workbook();
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();

  // Define the file name
  const fileName = "Users_Template";

  // Create sheets: one for user input and one for data reference
  const userSheet = workbook.addWorksheet("Users");
  const dataSheet = workbook.addWorksheet("Data");

  // Define columns for the "Users" sheet (user input)
  userSheet.columns = [
    { header: "fuId", key: "fuId", width: 15 },
    { header: "lastName", key: "lastName", width: 25 },
    { header: "firstName", key: "firstName", width: 20 },
    { header: "email", key: "email", width: 30 },
    { header: "phoneNumber", key: "phoneNumber", width: 20 },
    { header: "department", key: "department", width: 20 }, // dropdown
    { header: "gender", key: "gender", width: 20 }, // dropdown
    { header: "role", key: "role", width: 20 }, // dropdown
  ];

  // Add an example row with placeholders for the user to replace
  userSheet.addRow({
    fuId: "",
    lastName: "",
    firstName: "",
    email: "",
    phoneNumber: "",
    department: "", // dropdown
    gender: "", // dropdown
    role: "", // dropdown
  });

  // Define columns for the "Data" sheet
  dataSheet.columns = [
    { header: "Role", key: "role", width: 20 },
    { header: "Gender", key: "gender", width: 20 },
    { header: "Department", key: "department", width: 55 },
  ];

  dataSheet.protect("user_import_key", {
    selectLockedCells: false,
    selectUnlockedCells: false,
  });

  // Populate the "Data" sheet with listOfRole, listOfGenders, and listOfDepartment
  listOfRole.forEach((role) => dataSheet.addRow({ role }));
  listOfGenders.forEach((gender) => dataSheet.addRow({ gender }));
  listOfDepartment.forEach((department) => dataSheet.addRow({ department }));

  // Populate dropdowns in the "Users" sheet
  const rangeEndRole = listOfRole.length + 1;
  const rangeEndGender = listOfGenders.length + 1;
  const rangeEndDepartment = listOfDepartment.length + 1;
  console.log(rangeEndRole, rangeEndGender, rangeEndDepartment);
  userSheet.getColumn("role").eachCell((cell, rowNumber) => {
    if (rowNumber > 1) {
      cell.dataValidation = {
        type: "list",
        formulae: [`'Data'!$A$2:$A$${rangeEndRole}`],
        showErrorMessage: true,
        error: "Please select from the dropdown options.",
      };
    }
  });

  userSheet.getColumn("gender").eachCell((cell, rowNumber) => {
    if (rowNumber > 1) {
      cell.dataValidation = {
        type: "list",
        formulae: [`'Data'!$B$4:$B$${rangeEndGender + 2}`],
        showErrorMessage: true,
        error: "Please select from the dropdown options.",
      };
    }
  });

  userSheet.getColumn("department").eachCell((cell, rowNumber) => {
    if (rowNumber > 1) {
      cell.dataValidation = {
        type: "list",
        formulae: [`'Data'!$C$6:$C$${rangeEndDepartment + 4}`],
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

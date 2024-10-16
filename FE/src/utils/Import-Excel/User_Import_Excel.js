import * as XLSX from "xlsx";

/**
 * Process the uploaded file and extract staff data from the Excel file.
 * @param {File} file - The uploaded Excel file
 * @returns {Promise<Array>} - Promise resolving to an array of staff objects
 */
export const User_Import_Excel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;

      // Read the workbook
      const workbook = XLSX.read(binaryStr, { type: "array" });

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON
      const data = XLSX.utils.sheet_to_json(sheet);

      // Validate and map data
      const staffData = data.map((item) => {
        const {
          fuId,
          firstName,
          lastName,
          email,
          phoneNumber,
          department,
          gender,
          role,
        } = item; // Adjust these names based on your Excel column headers

        if (
          !fuId ||
          !firstName ||
          !lastName ||
          !email ||
          !phoneNumber ||
          !department ||
          !gender ||
          !role
        ) {
          throw new Error("Invalid data in Excel file");
        }
        return {
          fuId,
          firstName,
          lastName,
          email,
          phoneNumber,
          department,
          gender,
          role,
        };
      });

      resolve(staffData);
    };

    reader.onerror = (error) => {
      reject(new Error("Error reading file: " + error.message));
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
};

import * as XLSX from "xlsx";

/**
 * Process the uploaded file and extract staff data from the "Users" sheet in the Excel file.
 * @param {File} file - The uploaded Excel file
 * @returns {Promise<Array>} - Promise resolving to an array of staff objects
 */
export const User_Import_Excel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;

      try {
        // Read the workbook
        const workbook = XLSX.read(binaryStr, { type: "array" });

        // Get the "Users" sheet
        const sheetName = "Users";
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
          reject(new Error("No 'Users' sheet found in the Excel file."));
          return;
        }

        // Convert sheet to JSON
        const data = XLSX.utils.sheet_to_json(sheet);

        // Map and validate data
        const usersData = data
          .map((item) => {
            const {
              fuId,
              firstName,
              lastName,
              email,
              phoneNumber,
              department,
              gender,
              role,
            } = item;

            // Validate required fields
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
              return null; // Skip this row if required fields are missing
            }

            // Validate FUID length
            if (fuId.length > 15) {
              console.warn("Row has invalid FUID length:", item);
              return null; // Skip rows with invalid FUID length
            }
            // Validate email: only for @fpt.edu.vn or @fe.edu.vn and <= 50 characters
            if (
              !email.endsWith("@fpt.edu.vn") &&
              !email.endsWith("@fe.edu.vn")
            ) {
              console.warn("Row has invalid email:", item);
              return null; // Skip rows with invalid email
            }

            if (email.length > 50) {
              console.warn("Row has invalid email length:", item);
              return null; // Skip rows with invalid email length
            }

            // lastname <= 50 characters
            if (lastName.length > 50) {
              console.warn("Row has invalid last name length:", item);
              return null; // Skip rows with invalid last name length
            }
            // firstname <= 50 characters
            if (firstName.length > 30) {
              console.warn("Row has invalid first name length:", item);
              return null; // Skip rows with invalid first name length
            }

            // Create user object
            const userObj = {
              fuId,
              firstName,
              lastName,
              email,
              phoneNumber,
              department,
              gender: gender == "Male" ? true : false,
              role: role == "Staff" ? 2 : 3,
            };

            return userObj;
          })
          .filter((item) => item !== null); // Remove any invalid rows

        resolve(usersData);
      } catch (error) {
        reject(new Error("Error processing Excel file: " + error.message));
      }
    };

    reader.onerror = (error) => {
      reject(new Error("Error reading file: " + error.message));
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
};

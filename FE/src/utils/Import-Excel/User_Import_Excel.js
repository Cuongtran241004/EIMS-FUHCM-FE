import * as XLSX from "xlsx";

/**
 * Process the uploaded file and extract staff data from the "Users" sheet in the Excel file.
 * @param {File} file - The uploaded Excel file
 * @returns {Promise<{data: Array, errors: Array}>} - Promise resolving to an object containing valid data and errors
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
          reject(
            new Error(`No sheet named '${sheetName}' found in the Excel file.`)
          );
          return;
        }

        // Convert sheet to JSON
        const data = XLSX.utils.sheet_to_json(sheet);

        // Arrays to hold the valid data and errors
        const usersData = [];
        const errors = [];

        // Map and validate data
        data.forEach((item, index) => {
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
            errors.push({
              row: index + 1,
              message: "Missing required fields.",
            });
            return; // Skip this row if required fields are missing
          }

          // Validate phone number: only digits and 10 characters, starting with 0
          if (!/^[0-9]{10}$/.test(phoneNumber)) {
            errors.push({
              row: index + 1,
              message: "Invalid phone number.",
            });
            return;
          }

          // Validate FUID length
          if (fuId.length > 15) {
            errors.push({
              row: index + 1,
              message: "FUID length exceeds 15 characters.",
            });
            return;
          }

          // Validate email: only for @fpt.edu.vn or @fe.edu.vn and <= 50 characters
          const emailLower = email.toLowerCase();
          if (
            !emailLower.endsWith("@fpt.edu.vn") &&
            !emailLower.endsWith("@fe.edu.vn")
          ) {
            errors.push({
              row: index + 1,
              message: "Invalid email domain.",
            });
            return;
          }

          if (email.length > 50) {
            errors.push({
              row: index + 1,
              message: "Email length exceeds 50 characters.",
            });
            return;
          }

          // Validate names lengths
          if (firstName.length > 30) {
            errors.push({
              row: index + 1,
              message: "First name length exceeds 30 characters.",
            });
            return;
          }

          if (lastName.length > 50) {
            errors.push({
              row: index + 1,
              message: "Last name length exceeds 50 characters.",
            });
            return;
          }

          // Create user object for valid rows
          const userObj = {
            fuId,
            firstName,
            lastName,
            email,
            phoneNumber,
            department,
            gender: gender.toLowerCase() === "male", // Gender check case-insensitive
            role: role.toLowerCase() === "staff" ? 2 : 3, // Role check case-insensitive
          };

          usersData.push(userObj);
        });

        resolve({ data: usersData, errors }); // Return both data and errors
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

import * as XLSX from "xlsx";

/**
 * Process the uploaded file and extract exam schedule data from the "Exam Schedule" sheet.
 * @param {File} file - The uploaded Excel file
 * @returns {Promise<Object>} - Promise resolving to an object containing valid exam schedule data and errors
 */
export const Exam_Schedule_Import_Excel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;

      // Read the workbook
      const workbook = XLSX.read(binaryStr, { type: "array" });

      // Get the "Exam Schedule" sheet
      const sheetName = "Exam Schedule";
      const sheet = workbook.Sheets[sheetName];

      if (!sheet) {
        reject(new Error("No 'Exam Schedule' sheet found in the Excel file."));
        return;
      }

      // Convert sheet to JSON
      const data = XLSX.utils.sheet_to_json(sheet);

      const examScheduleData = [];
      const errors = [];

      data.forEach((item, index) => {
        try {
          const { subjectExamId, date, startTime, endTime, numberOfStudents } =
            item;

          // Validate required fields
          if (
            !subjectExamId ||
            !date ||
            !startTime ||
            !endTime ||
            !numberOfStudents
          ) {
            throw new Error("Missing required fields.");
          }

          // Check if numberOfStudents is a number
          if (isNaN(numberOfStudents)) {
            throw new Error("numberOfStudents must be a number.");
          }

          // Check and convert date in "DD/MM/YYYY" format
          let dateStr;
          const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Matches "DD/MM/YYYY" format

          if (typeof date === "string" && dateFormatRegex.test(date)) {
            // Convert from "DD/MM/YYYY" to "YYYY-MM-DD"
            dateStr = date.split("/").reverse().join("-");
          } else if (typeof date === "number") {
            // Convert Excel serial date number to JavaScript Date (assuming 1900-based Excel serial)
            const baseDate = new Date(1900, 0, 1); // January 1, 1900
            const actualDate = new Date(
              baseDate.getTime() + (date - 1) * 24 * 60 * 60 * 1000
            ); // Offset by Excel serial
            dateStr = actualDate.toISOString().split("T")[0];
          } else {
            throw new Error("Invalid date format. Please use 'DD/MM/YYYY'.");
          }

          // Convert the formatted date string to a Date object for use
          const formattedDate = new Date(dateStr);

          // check if startTime and endTime are numbers
          if (isNaN(startTime)) {
            throw new Error("Invalid startTime");
          }
          if (isNaN(endTime)) {
            throw new Error("Invalid endTime");
          }

          // Convert Excel time (decimal) to actual time
          const convertExcelTimeToDate = (excelTime, baseDate) => {
            const dateObj = new Date(baseDate);
            const hours = Math.floor(excelTime * 24); // Get the hours
            const minutes = Math.round((excelTime * 24 - hours) * 60); // Get the minutes
            dateObj.setHours(hours, minutes, 0, 0);
            return dateObj;
          };

          // Convert startTime and endTime to actual Date objects
          const startAt = convertExcelTimeToDate(
            startTime,
            formattedDate
          ).toISOString();
          const endAt = convertExcelTimeToDate(
            endTime,
            formattedDate
          ).toISOString();

          // Create valid exam schedule object
          const examScheduleObj = {
            subjectExamId,
            startAt,
            endAt,
            numberOfStudents: Number(numberOfStudents), // Ensure numberOfStudents is a number
            status: "NEEDS_ROOM_ASSIGNMENT",
          };

          examScheduleData.push(examScheduleObj);
        } catch (error) {
          // Capture row-specific errors
          errors.push({ row: index + 2, message: error.message }); // +2 to account for header and 1-based index
        }
      });

      resolve({ data: examScheduleData, errors });
    };

    reader.onerror = (error) => {
      reject(new Error("Error reading file: " + error.message));
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
};

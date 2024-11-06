import * as XLSX from "xlsx";

/**
 * Process the uploaded file and extract exam schedule data from the "Exam Schedule" sheet.
 * @param {File} file - The uploaded Excel file
 * @returns {Promise<Array>} - Promise resolving to an array of exam schedule objects
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

      // Map the data and combine the `date` and `startTime` to create `startAt`
      const examScheduleData = data
        .map((item) => {
          try {
            const {
              subjectExamId,
              date,
              startTime,
              endTime,
              numberOfStudents,
            } = item;

            // Validate required fields
            if (
              !subjectExamId ||
              !date ||
              !startTime ||
              !endTime ||
              !numberOfStudents
            ) {
              throw new Error(
                "Invalid data in Excel file: missing required fields."
              );
            }

            // Convert Excel time (decimal) to actual time
            const convertExcelTimeToDate = (excelTime, baseDate) => {
              const dateObj = new Date(baseDate);
              const hours = Math.floor(excelTime * 24); // Get the hours
              const minutes = Math.round((excelTime * 24 - hours) * 60); // Get the minutes
              dateObj.setHours(hours, minutes, 0, 0);
              return dateObj;
            };

            // Handle Excel date format (dd/mm/yyyy)
            const formattedDate = new Date(date.split("/").reverse().join("-")); // Convert from dd/mm/yyyy to yyyy-mm-dd

            // Convert startTime and endTime to actual Date objects
            const startAt = convertExcelTimeToDate(
              startTime,
              formattedDate
            ).toISOString();

            const endAt = convertExcelTimeToDate(
              endTime,
              formattedDate
            ).toISOString();

            return {
              subjectExamId,
              startAt,
              endAt,
              numberOfStudents,
            };
          } catch (error) {
            console.error("Error processing row:", item, error);
            return null; // Skip this row on error
          }
        })
        .filter((item) => item !== null); // Remove any invalid rows

      resolve(examScheduleData);
    };

    reader.onerror = (error) => {
      reject(new Error("Error reading file: " + error.message));
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
};

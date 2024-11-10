import moment from "moment";

const managerMapperUtil = {
  mapRequest: (requests) => {
    return requests.map((request) => {
      return {
        key: request.requestId,
        requestId: request.requestId,
        reason: request.reason,
        examSlotId: request.examSlotDetail?.examSlotId,
        startAt: request.examSlotDetail?.startAt,
        endAt: request.examSlotDetail?.endAt,
        fuId: request.fuId,
        email: request.email,
        subjectName: request.subject?.name,
        subjectCode: request.subject?.code,
        examType: request.examSlotDetail?.examType,
        status: request.status,
        requestType: request.requestType,
        note: request.note,
      };
    });
  },
  mapUnassignedInvigilator: (invigilators) => {
    return invigilators.map((invigilator) => {
      return {
        fuId: invigilator.fuId,
        firstName: invigilator.firstName,
        lastName: invigilator.lastName,
        email: invigilator.email,
      };
    });
  },
  mapConfigs: (configs) => {
    return configs.map((config) => {
      let displayType = "";
      let unit = "";
      switch (config.configType) {
        case "hourly_rate":
          displayType = "Hourly Rate";
          unit = "VND";
          break;
        case "allowed_slot":
          displayType = "Allowed Slot";
          unit = config.value === "1" ? "Slot" : "Slots";
          break;
        case "time_before_exam":
          displayType = "Time Before Exam";
          unit = config.value === "1" ? "Day" : "Days";
          break;
        case "time_before_open_registration":
          displayType = "Time Before Open Registration";
          unit = config.value === "1" ? "Day" : "Days";
          break;
        case "invigilator_room":
          displayType = "Invigilator Room";
          unit = "Room";
          break;
        case "time_before_close_registration":
          displayType = "Time Before Close Registration";
          unit = config.value === "1" ? "Day" : "Days";
          break;
        case "time_before_close_request":
          displayType = "Time Before Close Request";
          unit = config.value === "1" ? "Day" : "Days";
          break;
        case "check_in_time_before_exam_slot":
          displayType = "Check In Time Before Exam Slot";
          unit = "Minutes";
          break;
        case "check_out_time_after_exam_slot":
          displayType = "Check Out Time After Exam Slot";
          unit = "Minutes";
          break;
        case "extra_invigilator":
          displayType = "Extra Invigilator";
          unit = config.value === "1" ? "Person" : "People";
          break;
        default:
          break;
      }
      return {
        id: config.id,
        key: config.id,
        configType: config.configType,
        displayType: displayType,
        value: config.value,
        unit: unit,
      };
    });
  },
  mapExamSlotforAttendance: (examSlots) => {
    return examSlots.map((examSlot) => {
      return {
        key: examSlot.id,
        examSlotId: examSlot.id,
        startAt: examSlot.startAt,
        endAt: examSlot.endAt,
        examType: examSlot.subjectExamDTO?.examType,
        subjectName: examSlot.subjectExamDTO?.subjectName,
        subjectCode: examSlot.subjectExamDTO?.subjectCode,
        status: examSlot.status,
        updatedByLastName: examSlot.updatedByLastName,
        updatedByFirstName: examSlot.updatedByFirstName,
      };
    });
  },
  mapAttendanceList: (attendanceList) => {
    return attendanceList.map((attendance) => {
      return {
        id: attendance.id,
        key: attendance.id,
        attendanceId: attendance.id,
        fuId: attendance.invigilatorFuId,
        firstName: attendance.invigilatorFirstName,
        lastName: attendance.invigilatorLastName,
        email: attendance.invigilatorEmail,
        phone: attendance.invigilatorPhone,
        updateBy: attendance.updateBy,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        status: attendance.status,
      };
    });
  },
  mapAttendanceReport: (list) => {
    // check list is an array or not,
    if (!Array.isArray(list)) return [];
    return list.map((item) => {
      // detail is an array of attendance
      let attendance = [];
      if (item.invigilatorAttendanceList) {
        attendance = item.invigilatorAttendanceList.map((detail) => {
          return {
            key: detail.id,
            id: detail.id,
            subjectCode: detail.examSlot?.subjectExam?.subjectId?.code,
            subjectName: detail.examSlot?.subjectExam?.subjectId?.name,
            examType: detail.examSlot?.subjectExam?.examType,
            staffId: detail.examSlot?.updatedBy?.fuId || "-",
            staffFirstName: detail.examSlot?.updatedBy?.firstName || "-",
            staffLastName: detail.examSlot?.updatedBy?.lastName || "-",
            date: moment(detail.startAt).format("DD/MM/YYYY"),
            startAt: moment(detail.startAt).format("HH:mm"),
            endAt: moment(detail.endAt).format("HH:mm"),
          };
        });
      }
      return {
        key: item.id,
        id: item.id,
        fuId: item.fuId,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        phone: item.phoneNum,
        totalSlots: item.totalExamSlots,
        totalHours: item.totalHours,
        hourlyRate: item.hourlyRate,
        fee: item.preCalculatedInvigilatorFree,
        detail: attendance,
      };
    });
  },
  mapTodayExamSlots: (examSlots) => {
    // check examSlots is an array or not,
    if (!Array.isArray(examSlots)) return [];
    return examSlots.map((examSlot) => {
      return {
        key: examSlot.id,
        id: examSlot.id,
        examSlotId: examSlot.id,
        startAt: examSlot.startAt,
        endAt: examSlot.endAt,
        examType: examSlot.subjectExamDTO?.examType,
        subjectName: examSlot.subjectExamDTO?.subjectName,
        subjectCode: examSlot.subjectExamDTO?.subjectCode,
        status: examSlot.status,
      };
    });
  },
  mapTodayInvigilators: (invigilators) => {
    // check invigilators is an array or not,
    if (!Array.isArray(invigilators)) return [];
    return invigilators.map((invigilator) => {
      return {
        key: invigilator.id,
        id: invigilator.id,
        fuId: invigilator.invigilatorFuId,
        firstName: invigilator.invigilatorFirstName,
        lastName: invigilator.invigilatorLastName,
        email: invigilator.invigilatorEmail,
        phone: invigilator.invigilatorPhone,
      };
    });
  },
  mapExamSlotSummary: (examSlots) => {
    // check examSlots is an array or not,
    if (!Array.isArray(examSlots)) return [];
    return examSlots.map((examSlot) => {
      return {
        date: examSlot.date,
        total: examSlot.totalExamSlots,
      };
    });
  },
  mapInvigilatorSummary: (invigilators) => {
    // check invigilators is an array or not,
    if (!Array.isArray(invigilators)) return [];
    return invigilators.map((invigilator) => {
      return {
        subjectCode: invigilator.examSlot?.subjectExamDTO?.subjectCode,
        subjectName: invigilator.examSlot?.subjectExamDTO?.subjectName,
        examType: invigilator.examSlot?.subjectExamDTO?.examType,
        registered:
          invigilator.totalInvigilatorsRegistered +
          invigilator.totalInvigilatorsAssigned,
        assigned: invigilator.totalInvigilatorsAssigned,
        startAt: invigilator.examSlot.startAt,
        endAt: invigilator.examSlot.endAt,
      };
    });
  },
};

export { managerMapperUtil };

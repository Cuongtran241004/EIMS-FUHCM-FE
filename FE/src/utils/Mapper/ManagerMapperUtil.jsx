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
      let configType = "";
      let unit = "";
      switch (config.configType) {
        case "hourly_rate":
          configType = "Hourly Rate";
          unit = "VND";
          break;
        case "allowed_slot":
          configType = "Allowed Slot";
          unit = config.value === "1" ? "Slot" : "Slots";
          break;
        case "time_before_exam":
          configType = "Time Before Exam";
          unit = config.value === "1" ? "Day" : "Days";
          break;
        case "time_before_open_registration":
          configType = "Time Before Open Registration";
          unit = config.value === "1" ? "Day" : "Days";
          break;
        case "invigilator_room":
          configType = "Invigilator Room";
          unit = "Room";
          break;
        case "time_before_close_registration":
          configType = "Time Before Close Registration";
          unit = config.value === "1" ? "Day" : "Days";
          break;
        case "time_before_close_request":
          configType = "Time Before Close Request";
          unit = config.value === "1" ? "Day" : "Days";
          break;
        case "check_in_time_before_exam_slot":
          configType = "Check In Time Before Exam Slot";
          unit = "Minutes";
          break;
        case "check_out_time_after_exam_slot":
          configType = "Check Out Time After Exam Slot";
          unit = "Minutes";
          break;
        case "extra_invigilator":
          configType = "Extra Invigilator";
          unit = config.value === "1" ? "Person" : "People";
          break;
        default:
          break;
      }
      return {
        id: config.id,
        key: config.id,
        configType: configType,
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
      };
    });
  },

  mapAttendanceReport: (list) => {
    return list.map((item) => {
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
      };
    });
  },
};

export { managerMapperUtil };

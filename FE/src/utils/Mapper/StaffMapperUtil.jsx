const staffMapperUtil = {
  mapSubject: (subjects) => {
    // check if subjects is an array
    if (!Array.isArray(subjects)) {
      return [];
    }

    return subjects.map((subject) => {
      return {
        key: subject.id,
        id: subject.id,
        code: subject.code,
        name: subject.name,
        semesterId: subject.semesterId,
        semesterName: subject.semesterName,
      };
    });
  },
  mapExamSchedule: (examSchedule) => {
    // check if examSchedule is an array
    if (!Array.isArray(examSchedule)) {
      return [];
    }
    return examSchedule.map((item) => {
      return {
        key: item.id,
        id: item.id,
        examId: item.subjectExamDTO?.subjectExamId,
        subjectCode: item.subjectExamDTO?.subjectCode,
        subjectName: item.subjectExamDTO?.subjectName,
        examType: item.subjectExamDTO?.examType,
        startAt: item.startAt,
        endAt: item.endAt,
        numberOfStudents: item.numberOfStudents || 0,
        status: item.status,
      };
    });
  },
  mapExamSlot: (item) => {
    return {
      key: item.id,
      id: item.id,
      examId: item.subjectExamDTO?.subjectExamId,
      subjectCode: item.subjectExamDTO?.subjectCode,
      subjectName: item.subjectExamDTO?.subjectName,
      examType: item.subjectExamDTO?.examType,
      startAt: item.startAt,
      endAt: item.endAt,
      status: item.status,
    };
  },
  mapAssignment: (assignments) => {
    // check if assignments is an array
    if (!Array.isArray(assignments)) {
      return [];
    }
    return assignments.map((item) => {
      return {
        key: item.examSlotRoomId,
        id: item.examSlotRoomId,
        examSlotId: item.examSlotId,
        startAt: item.startAt,
        endAt: item.endAt,
        roomFuId: item.roomInvigilatorFuId,
        roomFirstName: item.roomInvigilatorFirstName,
        roomLastName: item.roomInvigilatorLastName,
        hallFuId: item.hallInvigilatorFuId,
        hallFirstName: item.hallInvigilatorFirstName,
        hallLastName: item.hallInvigilatorLastName,
        roomId: item.roomId,
        roomName: item.roomName,
      };
    });
  },
  mapAllAttendanceByDate: (attendances) => {
    // check if attendance is an array
    if (!Array.isArray(attendances)) {
      return [];
    }
    return attendances.map((item) => {
      return {
        key: item.id,
        id: item.id,
        startAt: item.startAt,
        endAt: item.endAt,
        examSlotId: item.examSlotId,
        status: item.status,
      };
    });
  },
  mapAttendance: (attendances) => {
    // check if attendance is an array
    if (!Array.isArray(attendances)) {
      return [];
    }
    return attendances.map((item) => {
      return {
        key: item.id,
        id: item.id,
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        firstName: item.invigilatorFirstName,
        lastName: item.invigilatorLastName,
        fuId: item.invigilatorFuId,
        status: item.status,
      };
    });
  },
  mapExamSlotWithStatus: (examSchedule) => {
    // check if examSchedule is an array
    if (!Array.isArray(examSchedule)) {
      return [];
    }
    return examSchedule.map((item) => {
      return {
        key: item.examSlotId,
        id: item.examSlotId,
        subjectCode: item.subjectCode,
        examType: item.examType,
        numberOfRegistered: item.numberOfRegistered,
        requiredInvigilators: item.requiredInvigilators,
        startAt: item.startAt,
        endAt: item.endAt,
        status: item.status,
      };
    });
  },
};
export { staffMapperUtil };

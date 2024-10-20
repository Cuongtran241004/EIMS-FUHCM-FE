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
        subjectCode: item.subjectExamDTO?.subjectCode || "Loading",
        subjectName: item.subjectExamDTO?.subjectName || "Loading",
        examType: item.subjectExamDTO?.examType || "Loading",
        startAt: item.startAt,
        endAt: item.endAt,
        status: item.status,
      };
    });
  },
  mapExamSlot: (item) => {
    return {
      key: item.id,
      id: item.id,
      examId: item.subjectExamDTO?.subjectExamId,
      subjectCode: item.subjectExamDTO?.subjectCode || "Loading",
      subjectName: item.subjectExamDTO?.subjectName || "Loading",
      examType: item.subjectExamDTO?.examType || "Loading",
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
};
export { staffMapperUtil };

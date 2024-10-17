const staffMapperUtil = {
  mapSubject: (subjects) => {
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
};
export { staffMapperUtil };

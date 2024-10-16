const staffMapperUtil = {
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

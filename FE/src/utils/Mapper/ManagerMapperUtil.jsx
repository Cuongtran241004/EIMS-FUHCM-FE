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
};

export { managerMapperUtil };

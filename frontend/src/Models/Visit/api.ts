import { UB_VISIT_STATUS, USER_VISIT_STATUS } from '@/Components/Pages/Visits/const';

export type CreateVisitRequest = {
  form: {
    userToVisitId: string;
    passportFullName: string;
    passportSeries: string;
    passportNumber: string;
    passportWhoIssued: string;
    passportIssueDate: string;
    passportPhoto?: string;
    visitTime: string;
    visitReason: string;
    emailToSendReply: string;
  };
};

export type VisitRequest = {
  id: string;
  form: {
    userToVisitId: string;
    passportFullName: string;
    passportIssueDate: string;
    passportNumber: string;
    passportPhoto: string;
    passportSeries: string;
    passportWhoIssued: string;
    visitTime: string;
    visitReason: string;
    emailToSendReply: string;
  };
  status: keyof typeof USER_VISIT_STATUS | keyof typeof UB_VISIT_STATUS;
};
export type GetVisitsResponse = {
  visitRequests: VisitRequest[];
};

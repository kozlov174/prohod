import { VisitStatus } from '@/Models/Visit/client';

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
    visitTime: string;
    visitReason: string;
    emailToSendReply: string;
  };
  status: VisitStatus;
};
export type GetVisitsResponse = {
  visitRequests: VisitRequest[];
};

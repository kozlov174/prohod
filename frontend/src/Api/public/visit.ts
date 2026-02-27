import instance, { PagesURl } from '@/Api';
import { CreateVisitRequest, GetVisitsResponse, VisitRequest } from '@/Models/Visit/api';
import { VisitStatus } from '@/Models/Visit/client';

export async function createVisitRquest(data: CreateVisitRequest) {
  await instance.post(PagesURl.VISIT_FOR_USERS, data);
}

export async function getVisitRequestsByStatus(status: VisitStatus) {
  return (await instance.get<GetVisitsResponse>(PagesURl.VISIT_FOR_USERS, { params: { status } })).data;
}

export async function getVisitRequestById(visitId: string) {
  return (await instance.get<VisitRequest>(PagesURl.VISIT_FOR_USERS + visitId)).data;
}

export async function acceptVisitRequest(visitId: string) {
  await instance.post(PagesURl.VISIT_FOR_USERS + visitId + '/accept');
}

export async function rejectVisitRequest(visitId: string, rejectionReason: string) {
  await instance.post(PagesURl.VISIT_FOR_USERS + visitId + '/reject', { rejectionReason });
}

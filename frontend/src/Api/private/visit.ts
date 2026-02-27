import { PagesURl, privateInstance } from '@/Api';
import { CreateVisitRequest, GetVisitsResponse, VisitRequest } from '@/Models/Visit/api';
import { VisitStatus } from '@/Models/Visit/client';

export async function createVisitRquest(data: CreateVisitRequest) {
  await privateInstance.post(PagesURl.VISIT_FOR_USERS, data);
}

export async function getVisitRequestsByStatus(status: VisitStatus) {
  return (await privateInstance.get<GetVisitsResponse>(PagesURl.VISIT_FOR_SECURITY, { params: { status } })).data;
}

export async function getVisitRequestById(visitId: string) {
  return (await privateInstance.get<VisitRequest>(PagesURl.VISIT_FOR_SECURITY + visitId)).data;
}

export async function acceptVisitRequest(visitId: string) {
  await privateInstance.post(PagesURl.VISIT_FOR_SECURITY + visitId + '/accept');
}

export async function rejectVisitRequest(visitId: string, rejectionReason: string) {
  await privateInstance.post(PagesURl.VISIT_FOR_SECURITY + visitId + '/reject', { rejectionReason });
}

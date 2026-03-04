import { PagesURl, privateInstance } from '@/Api';

export async function getJsonReport(startDate: string, endDate: string) {
  return await privateInstance.post(PagesURl.REPORT + '/json_report/', {}, { params: { startDate, endDate } });
}

export async function getExcelReport(startDate: string, endDate: string) {
  return await privateInstance.post(
    PagesURl.REPORT + '/excel_report/',
    {},
    { params: { startDate, endDate }, responseType: 'blob' }
  );
}

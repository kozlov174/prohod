import { PagesURl, privateInstance } from '@/Api';

export async function getJsonReport(startDate: string, endDate: string) {
  return (await privateInstance.get(PagesURl.REPORT + '/json_report', { params: { startDate, endDate }, headers: {} }))
    .data;
}

export async function getExcelReport(startDate: string, endDate: string) {
  return (await privateInstance.get(PagesURl.REPORT + '/excel_report', { params: { startDate, endDate }, headers: {} }))
    .data;
}

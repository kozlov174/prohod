import { getListFormObject } from '@/Utils';

export const VISIT_STATUS = {
  not_processed: 'Не обработана',
  reject: 'Отклоненная',
  accept: 'Принята УБ',
  user_accept: 'Принята',
};
export const VISIT_STATUS_LIST = getListFormObject(VISIT_STATUS);

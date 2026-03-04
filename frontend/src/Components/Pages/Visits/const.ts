import { getListFormObject } from '@/Utils';

export const UB_VISIT_STATUS = {
  user_accept: 'Не обработана',
  reject: 'Отклоненная',
  accept: 'Принята',
};

export const USER_VISIT_STATUS = {
  not_processed: 'Не обработана',
  reject: 'Отклоненная',
  user_accept: 'Принята',
  accept: 'Принята УБ',
};

export const USER_VISIT_STATUS_LIST = getListFormObject(USER_VISIT_STATUS);
export const UB_VISIT_STATUS_LIST = getListFormObject(UB_VISIT_STATUS);

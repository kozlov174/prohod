import { getListFormObject } from '@/Utils';

export const VISIT_STATUS = {
  not_processed: 'Активные',
  reject: 'Отклоненный',
  accept: 'Принятые',
};
export const VISIT_STATUS_LIST = getListFormObject(VISIT_STATUS);

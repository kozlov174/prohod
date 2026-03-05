import { ListValueChema } from '@/Schemas';
import * as yup from 'yup';

export const enterFormSchema = yup.object().shape({
  userToVisit: ListValueChema().required('Выберите кого посещаете'),
  passportFullName: yup.string().required('Введите ФИО'),
  passportSeries: yup.number().required('Введите серию паспорта'),
  passportNumber: yup.number().required('Введите номер паспорта'),
  passportWhoIssued: yup.string().required('Введите кем выдан'),
  passportIssueDate: yup.string().required('Введите дату выдачи'),
  passportPhoto: yup.mixed<File>().required('Загрузите фото'),
  visitTime: yup.string().required('Введите время визита'),
  visitDate: yup.string().required('Введите дату визита'),
  visitReason: yup.string().required('Введите цель визита'),
  emailToSendReply: yup.string().required('Введите почту').email('Введите корректную почту'),
  isCheckedEmail: yup.boolean().default(false),
  isGetApproval: yup
    .boolean()
    .test('isGetApproval', 'Вы должны согласиться с политикой обработки персональных данных', value => value === true),
});

import * as yup from 'yup';

export const createReportSchema = yup.object().shape({
  startDate: yup.string().required('Введите начальную дату'),
  endDate: yup
    .string()
    .required('Введите конечную дату')
    .test('is-after-start', 'Дата окончания должна быть позже даты начала', function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) > new Date(startDate);
    }),
  reportType: yup.mixed<'json' | 'excel'>().required('Выберите тип отчета'),
});

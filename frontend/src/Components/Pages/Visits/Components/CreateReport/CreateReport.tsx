import { JSX, memo, useRef } from 'react';
import styles from './Styles.module.scss';
import { Popup } from '@/Components/Layouts/Popup';
import { Input } from '@/Components/UI/Input';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createReportSchema } from '@/Components/Pages/Visits/Components/CreateReport/schema';
import { Button } from '@/Components/UI/Button';
import { InferType } from 'yup';
import { getExcelReport, getJsonReport } from '@/Api/private/report';

interface CreateReportProps {
  onClose: () => void;
}

function CreateReportComponent({ onClose }: CreateReportProps): JSX.Element {
  const submitButton = useRef<HTMLButtonElement>(null);
  const createReportForm = useForm({
    resolver: yupResolver(createReportSchema),
    mode: 'onTouched',
    defaultValues: {
      reportType: 'json',
    },
  });

  const onCreateJSON = () => {
    createReportForm.setValue('reportType', 'json');
    submitButton.current?.click();
  };
  const onCreateEXCEL = () => {
    createReportForm.setValue('reportType', 'excel');
    submitButton.current?.click();
  };

  const onSubmit = (data: InferType<typeof createReportSchema>) => {
    if (data.reportType === 'json') {
      getJsonReport(data.startDate, data.endDate);
    } else {
      getExcelReport(data.startDate, data.endDate);
    }
  };

  return (
    <Popup displayCloseButton onClose={onClose}>
      <form onSubmit={createReportForm.handleSubmit(onSubmit)} className={styles.createReport}>
        <h2>Создание отчета</h2>
        <div className={styles.createReport__line}>
          <Controller
            name="startDate"
            control={createReportForm.control}
            render={({ field }) => (
              <Input
                label="Дата начала"
                error={createReportForm.formState.errors[field.name]?.message}
                placeholder="Начальная дата"
                type="date"
                {...field}
              />
            )}
          />
          <Controller
            name="endDate"
            control={createReportForm.control}
            render={({ field }) => (
              <Input
                label="Дата окончания"
                error={createReportForm.formState.errors[field.name]?.message}
                placeholder="Конечная дата"
                type="date"
                {...field}
              />
            )}
          />
        </div>
        <Button onClick={onCreateJSON} size="s">
          Скчать отчет в JSON
        </Button>
        <Button onClick={onCreateEXCEL} size="s">
          Скчать отчет в EXCEL
        </Button>
        <button type="submit" ref={submitButton} style={{ display: 'none' }} />
      </form>
    </Popup>
  );
}

export const CreateReport = memo(CreateReportComponent);

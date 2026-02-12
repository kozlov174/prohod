import { JSX, memo, useEffect, useState } from 'react';
import styles from './Styles.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { enterFormSchema } from '@/Components/Pages/Enter/schema';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { Button } from '@/Components/UI/Button';
import { Checkbox } from '@/Components/UI/Checkbox';
import { sendVerifyEmail, verifyEmail } from '@/Api/public/verifyEmail';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@/Api/public/user';
import { pluralize } from '@/Utils';
import { Link } from 'react-router-dom';

function EnterComponent(): JSX.Element {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(),
  });
  const enterForm = useForm({
    resolver: yupResolver(enterFormSchema),
    mode: 'onChange',
  });

  const [sendedEmail, setSendedEmail] = useState<string>();

  const [code, setCode] = useState<string>();
  const [isCodeDone, setIsCodeDone] = useState<boolean>(false);

  const [timer, setTimer] = useState<number>();

  const onSendCode = async () => {
    const email = enterForm.getFieldState('emailToSendReply');
    if (email.error) {
      enterForm.setError('emailToSendReply', {
        type: 'manual',
        message: 'Введите корректный email',
      });
    } else {
      const emailValue = enterForm.getValues('emailToSendReply');
      sendVerifyEmail(emailValue);
      setSendedEmail(emailValue);
      setTimer(60);
    }
  };

  const onVerifyCode = async () => {
    if (!code || !sendedEmail) {
      toast.error('Введите код');
      return;
    }
    try {
      await verifyEmail(sendedEmail, code);
      setIsCodeDone(true);
    } catch {
      toast.error('Неверный код');
    }
  };

  useEffect(() => {
    if (!timer) return;

    if (timer <= 0) {
      setTimer(undefined);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev && prev > 0) {
          return prev - 1;
        }
        return undefined;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className={styles.container}>
      <form className={styles.container__form}>
        <Link to="/">
          <img src="/logo.svg" alt="УрФУ" className={styles.container__logo} />
        </Link>
        <h2 className={styles.container__title}>{'Проход'}</h2>
        <p>1. Заполните паспортные данные</p>
        <Controller
          name="passportFullName"
          control={enterForm.control}
          render={({ field }) => (
            <Input
              type="text"
              onChange={field.onChange}
              error={enterForm.formState.errors[field.name]?.message}
              value={field.value}
              label="ФИО"
              placeholder="Введите ФИО"
            />
          )}
        />
        <div className={styles.container__line}>
          <Controller
            name="passportSeries"
            control={enterForm.control}
            render={({ field }) => (
              <Input
                type="number"
                onChange={field.onChange}
                error={enterForm.formState.errors[field.name]?.message}
                value={field.value}
                label="Номер паспорта"
                placeholder="Введите номер паспорта"
              />
            )}
          />
          <Controller
            name="passportNumber"
            control={enterForm.control}
            render={({ field }) => (
              <Input
                type="number"
                onChange={field.onChange}
                error={enterForm.formState.errors[field.name]?.message}
                value={field.value}
                label="Номер паспорта"
                placeholder="Введите номер паспорта"
              />
            )}
          />
        </div>
        <div className={styles.container__line}>
          <Controller
            name="passportWhoIssued"
            control={enterForm.control}
            render={({ field }) => (
              <Input
                type="number"
                onChange={field.onChange}
                error={enterForm.formState.errors[field.name]?.message}
                value={field.value}
                label="Код подразделения"
                placeholder="Введите код подразделения"
              />
            )}
          />
          <Controller
            name="passportIssueDate"
            control={enterForm.control}
            render={({ field }) => (
              <Input
                type="date"
                onChange={field.onChange}
                error={enterForm.formState.errors[field.name]?.message}
                value={field.value}
                label="Дата выдачи"
                placeholder="Введите дату выдач"
              />
            )}
          />
        </div>
        <p>2. Уточните детали визита</p>
        <div className={styles.container__line}>
          <Controller
            name="visitDate"
            control={enterForm.control}
            render={({ field }) => (
              <Input
                type="date"
                onChange={field.onChange}
                error={enterForm.formState.errors[field.name]?.message}
                value={field.value}
                label="Дата посещения"
                placeholder="Введите дату посещения"
              />
            )}
          />
          <Controller
            name="visitTime"
            control={enterForm.control}
            render={({ field }) => (
              <Input
                type="time"
                onChange={field.onChange}
                error={enterForm.formState.errors[field.name]?.message}
                value={field.value}
                label="Время посещения"
                placeholder="Введите время посещения"
              />
            )}
          />
        </div>
        <Controller
          name="userToVisit"
          control={enterForm.control}
          render={({ field }) => (
            <Select
              type="single"
              onChange={field.onChange}
              error={enterForm.formState.errors[field.name]?.message}
              selectedValue={field.value}
              list={users?.users.map(user => ({ id: user.id, value: `${user.surname} ${user.name}` })) || []}
              label="Кого посещаете?"
              placeholder="Выберите значение"
            />
          )}
        />
        <Controller
          name="visitReason"
          control={enterForm.control}
          render={({ field }) => (
            <Input
              type="text"
              onChange={field.onChange}
              error={enterForm.formState.errors[field.name]?.message}
              value={field.value}
              label="Цель визита"
              placeholder="Введите цель визита"
            />
          )}
        />
        <p>3. Куда придет QR-код для посещения</p>
        <div className={cn(styles.container__email, sendedEmail && styles.container__email_active)}>
          <Controller
            name="emailToSendReply"
            control={enterForm.control}
            render={({ field }) => (
              <Input
                type="text"
                onChange={field.onChange}
                error={enterForm.formState.errors[field.name]?.message}
                value={field.value}
                label="Куда придет код для посещения"
                placeholder="Введите email"
              />
            )}
          />
          {!!sendedEmail || (
            <div className={styles.container__send}>
              <Button onClick={onSendCode} size="s">
                Отправить код
              </Button>
            </div>
          )}
        </div>
        {sendedEmail && (
          <>
            <div className={cn(styles.container__code)}>
              <Input type="text" onChange={setCode} value={code || ''} label="Введите код" placeholder="код" />
              <div className={styles.container__send}>
                <Button onClick={onVerifyCode} size="s">
                  Подтвердить код
                </Button>
              </div>
            </div>
            <span>
              {`Код отправлен на ${sendedEmail}`}{' '}
              {timer ? (
                <span>{`отправить повторно через ${pluralize(timer, { 1: 'секунду', 2: 'секунды', 3: 'секунды', 4: 'секунды', 5: 'секунд' })}`}</span>
              ) : (
                <span onClick={onSendCode} className={styles.container__repeat}>
                  отправить повторно
                </span>
              )}
            </span>
          </>
        )}
        {isCodeDone && (
          <div className={styles.container__sendBlock}>
            <Controller
              name="isGetApproval"
              control={enterForm.control}
              render={({ field }) => (
                <Checkbox
                  onChange={() => field.onChange(!field.value)}
                  isActive={field.value}
                  label="Даю согласие на обработку персональных данных"
                />
              )}
            />
            <Button size="s">Отправить заявку</Button>
          </div>
        )}
      </form>
    </div>
  );
}

export const Enter = memo(EnterComponent);

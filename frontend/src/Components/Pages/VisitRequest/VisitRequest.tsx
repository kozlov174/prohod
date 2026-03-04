import { JSX, memo, useState } from 'react';
import styles from './Styles.module.scss';
import { Input } from '@/Components/UI/Input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acceptVisitRequest, getVisitRequestById, rejectVisitRequest } from '@/Api/public/visit';
import {
  getVisitRequestById as getPrivateVisitRequestById,
  acceptVisitRequest as privateAcceptVisitRequest,
  rejectVisitRequest as privateRejectVisitRequest,
} from '@/Api/private/visit';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '@/Components/UI/Loader';
import { getPrettyDate } from '@/Utils/date';
import { USER_VISIT_STATUS, UB_VISIT_STATUS } from '@/Components/Pages/Visits/const';
import { Button } from '@/Components/UI/Button';
import { toast } from 'react-toastify';
import { Popup } from '@/Components/Layouts/Popup';
import { getMe } from '@/Api/public/auth';
import { getMe as privateGetMe } from '@/Api/private/auth';
import { VisitStatus } from '@/Models/Visit/client';

interface VisitRequestProps {
  isPublic: boolean;
}

function VisitRequestComponent({ isPublic }: VisitRequestProps): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rejectReason, setRejectReason] = useState<string | null>(null);
  const { data: me } = useQuery({
    queryFn: isPublic ? getMe : privateGetMe,
    queryKey: ['me'],
  });
  const { data: visit, isLoading } = useQuery({
    queryFn: () => (isPublic ? getVisitRequestById(id || '') : getPrivateVisitRequestById(id || '')),
    queryKey: ['visit', id],
    enabled: !!id,
  });
  const acceptVisitRequestMutation = useMutation({
    mutationFn: () => (isPublic ? acceptVisitRequest(id || '') : privateAcceptVisitRequest(id || '')),
    onSuccess: () => {
      toast.success('Визит принят');
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['visit', id] });
    },
  });
  const rejectVisitRequestMutation = useMutation({
    mutationFn: () =>
      isPublic
        ? rejectVisitRequest(id || '', rejectReason || '')
        : privateRejectVisitRequest(id || '', rejectReason || ''),
    onSuccess: () => {
      toast.error('Визит отклонен');
      setRejectReason(null);
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['visit', id] });
    },
  });

  const isVisibleButtons = (status: VisitStatus) => {
    console.log(status, me?.role);
    return (status === 'not_processed' && me?.role === 'user') || (status === 'user_accept' && me?.role === 'security');
  };

  if (isLoading) {
    return <Loader size="fullBlock" />;
  }

  if (!visit || !me) {
    return <h2>Ошибка при получении данных</h2>;
  }

  console.log(visit);

  return (
    <>
      <div className={styles.visitRequest}>
        <h2>Детали визита</h2>
        <Input
          disabled
          label="Время посещения"
          onChange={() => {}}
          type="text"
          value={getPrettyDate(visit.form.visitTime)}
        />
        <Input disabled label="Причина" onChange={() => {}} type="text" value={visit.form.visitReason} />
        <Input
          disabled
          label="Статус"
          onChange={() => {}}
          type="text"
          value={
            isPublic
              ? USER_VISIT_STATUS[visit.status as keyof typeof USER_VISIT_STATUS]
              : UB_VISIT_STATUS[visit.status as keyof typeof UB_VISIT_STATUS]
          }
        />
        <div className={styles.visitRequest__buttons}>
          <Button onClick={() => navigate('/visits')} size="s" color="secondary">
            Назад
          </Button>
          {isVisibleButtons(visit.status) && (
            <div className={styles.visitRequest__mainButtons}>
              <Button
                disabled={rejectVisitRequestMutation.isPending || acceptVisitRequestMutation.isPending}
                size="s"
                color="red"
                onClick={() => setRejectReason('')}
              >
                {rejectVisitRequestMutation.isPending || acceptVisitRequestMutation.isPending ? '...' : `Отклонить`}
              </Button>
              <Button
                disabled={rejectVisitRequestMutation.isPending || acceptVisitRequestMutation.isPending}
                size="s"
                color="blue"
                onClick={() => acceptVisitRequestMutation.mutateAsync()}
              >
                {rejectVisitRequestMutation.isPending || acceptVisitRequestMutation.isPending ? '...' : 'Принять'}
              </Button>
            </div>
          )}
        </div>
      </div>
      {typeof rejectReason === 'string' && (
        <Popup padding={20} displayCloseButton onClose={() => setRejectReason(null)}>
          <div className={styles.popup}>
            <Input label="Уточните причину отказа" type="text" onChange={setRejectReason} value={rejectReason} />
            <Button
              disabled={rejectVisitRequestMutation.isPending}
              size="s"
              color="red"
              onClick={() => rejectVisitRequestMutation.mutateAsync()}
            >
              {rejectVisitRequestMutation.isPending ? 'Отправка' : 'Отклонить'}
            </Button>
          </div>
        </Popup>
      )}
    </>
  );
}

export const VisitRequest = memo(VisitRequestComponent);

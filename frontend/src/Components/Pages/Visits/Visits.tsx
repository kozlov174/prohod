import { JSX, memo, useEffect, useState } from 'react';
import styles from './Styles.module.scss';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ListValue } from '@/Components/UI/Select/types';
import { VISIT_STATUS, VISIT_STATUS_LIST } from './const';
import { Table } from '@/Components/Widgets/Table';
import { useQuery } from '@tanstack/react-query';
import { getVisitRequestsByStatus } from '@/Api/public/visit';
import { getVisitRequestsByStatus as privateGetVisitRequestsByStatus } from '@/Api/private/visit';
import { VisitStatus } from '@/Models/Visit/client';
import { Loader } from '@/Components/UI/Loader';
import { getPrettyDate } from '@/Utils/date';
import { Pagination } from '@/Components/Widgets/Pagination';
import { Button } from '@/Components/UI/Button';
import { Link } from 'react-router-dom';
import { getPaginatedData } from '@/Utils/table';
import { CreateReport } from '@/Components/Pages/Visits/Components/CreateReport';
import { getTokenFromCookie, parseJwt } from '@/Utils/token';

interface VisitsProps {
  isPublic?: boolean;
}

function VisitsComponent({ isPublic }: VisitsProps): JSX.Element {
  const [search, setSearch] = useState('');
  const [isDisplayNewReport, setIsDisplayNewReport] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ListValue>(VISIT_STATUS_LIST[0]);
  const [activePage, setActivePage] = useState(1);
  const [activeViews, setActiveViews] = useState(10);
  const tokenData = parseJwt(getTokenFromCookie('access'));
  const { data: visits, isLoading } = useQuery({
    queryFn: () => {
      if (isPublic) {
        return getVisitRequestsByStatus(selectedStatus.id as VisitStatus);
      } else {
        return privateGetVisitRequestsByStatus(selectedStatus.id as VisitStatus);
      }
    },
    queryKey: ['visits', selectedStatus.id],
  });

  useEffect(() => {
    setActivePage(1);
  }, [search]);
  if (isLoading) {
    return <Loader size="fullBlock" />;
  }

  return (
    <>
      <div className={styles.visits}>
        <h2>Посещения</h2>
        <div className={styles.visits__buttons}>
          {tokenData && (tokenData.role === 'admin' || tokenData?.role === 'security') && (
            <Link to="/users">
              <Button size="s">Добавить пользователя</Button>
            </Link>
          )}
          {tokenData && tokenData.role === 'admin' && (
            <Button onClick={() => setIsDisplayNewReport(true)} size="s">
              Отчеты
            </Button>
          )}
        </div>
        <div className={styles.visits__filters}>
          <Input label="Поиск" placeholder="Поиск" value={search} onChange={setSearch} type="search" />
          <Select
            label="Статус"
            type="single"
            selectedValue={selectedStatus}
            onChange={setSelectedStatus}
            list={VISIT_STATUS_LIST}
          />
        </div>
        {visits ? (
          <Table
            data={getPaginatedData(visits.visitRequests, activePage, activeViews, search).map(el => ({
              id: el.id,
              visitor: el.form.passportFullName,
              date: getPrettyDate(el.form.visitTime),
              status: VISIT_STATUS[el.status],
            }))}
            columns={[
              {
                name: 'ID заявки',
                backName: 'id',
              },
              {
                name: 'Посетитель',
                backName: 'visitor',
              },
              {
                name: 'Дата посещения',
                backName: 'date',
              },
              {
                name: 'Статус',
                backName: 'status',
              },
            ]}
          />
        ) : (
          <p>Ошибка при получении данных</p>
        )}
        {visits && (
          <Pagination
            selectedView={activeViews}
            setSelectedView={setActiveViews}
            activeStage={activePage - 1}
            totalStages={Math.ceil(visits?.visitRequests.length / activeViews)}
            changeActiveStage={setActivePage}
          />
        )}
      </div>
      {isDisplayNewReport && <CreateReport onClose={() => setIsDisplayNewReport(false)} />}
    </>
  );
}

export const Visits = memo(VisitsComponent);

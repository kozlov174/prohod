import { JSX, memo, useEffect, useState } from 'react';
import styles from './Styles.module.scss';
import { Button } from '@/Components/UI/Button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/Components/UI/Input';
import { Table } from '@/Components/Widgets/Table';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers, getSecurities } from '@/Api/private/user';
import { USER_ROLE } from '@/Constants/User';
import { Pagination } from '@/Components/Widgets/Pagination';
import { getPaginatedData } from '@/Utils/table';
import { AddUserPopup } from '@/Components/Pages/Users/Components/AddUserPopup';
import { PrivateUser } from '@/Models/Auth/api';
import { EditUserPopup } from '@/Components/Pages/Users/Components/EditUserPopup';

function UsersComponent(): JSX.Element {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [activeViews, setActiveViews] = useState(10);

  const [isDisplayNewUser, setIsDisplayNewUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState<PrivateUser | null>(null);

  const { data: users } = useQuery({
    queryFn: () => getAllUsers(),
    queryKey: ['users'],
  });

  const { data: securities } = useQuery({
    queryFn: () => getSecurities(),
    queryKey: ['securities'],
  });

  useEffect(() => {
    setActivePage(1);
  }, [search]);

  return (
    <div className={styles.users}>
      <Button onClick={() => navigate(-1)} size="s" color="secondary">
        Назад
      </Button>
      <div className={styles.users__filters}>
        <Input placeholder="Поиск" type="search" onChange={setSearch} value={search} />
        <Button onClick={() => setIsDisplayNewUser(true)} size="s">
          Добавить
        </Button>
      </div>
      {!users || !securities || (
        <>
          <Table
            columns={[
              {
                name: 'ID',
                backName: 'id',
              },
              {
                name: 'Логин',
                backName: 'login',
              },
              {
                name: 'Роль',
                backName: 'role',
              },
              {
                name: 'ФИО',
                backName: 'name',
              },
              {
                name: 'Email',
                backName: 'email',
              },
              {
                name: 'Статус',
                backName: 'status',
              },
            ]}
            data={getPaginatedData([...users.users, ...securities.securities], activePage, activeViews, search).map(
              el => ({
                id: el.id,
                login: el.login,
                role: USER_ROLE[el.role],
                name: el.name,
                email: el.userEmail,
                status: el.status === 'active' ? 'Активен' : 'Заблокирован',
              })
            )}
            onEdit={id => setUserToEdit([...users.users, ...securities.securities].find(el => el.id === id) || null)}
          />
          <Pagination
            totalStages={Math.ceil((users.users.length + securities.securities.length) / activeViews)}
            activeStage={activePage - 1}
            changeActiveStage={setActivePage}
            selectedView={activeViews}
            setSelectedView={setActiveViews}
          />
        </>
      )}
      {isDisplayNewUser && <AddUserPopup onClose={() => setIsDisplayNewUser(false)} />}
      {userToEdit && <EditUserPopup user={userToEdit} onClose={() => setUserToEdit(null)} />}
    </div>
  );
}

export const Users = memo(UsersComponent);

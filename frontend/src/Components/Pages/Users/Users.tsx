import { JSX, memo, useState } from 'react';
import styles from './Styles.module.scss';
import { Button } from '@/Components/UI/Button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/Components/UI/Input';
import { Table } from '@/Components/Widgets/Table';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers, getSecurities } from '@/Api/private/user';

function UsersComponent(): JSX.Element {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: users } = useQuery({
    queryFn: () => getAllUsers(),
    queryKey: ['users'],
  });

  const { data: securities } = useQuery({
    queryFn: () => getSecurities(),
    queryKey: ['securities'],
  });

  return (
    <div className={styles.users}>
      <Button onClick={() => navigate(-1)} size="s" color="secondary">
        Назад
      </Button>
      <div className={styles.users__filters}>
        <Input placeholder="Поиск" type="search" onChange={setSearch} value={search} />
        <Button size="s">Добавить</Button>
      </div>
      {!users || !securities || (
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
          data={[...users.users, ...securities]}
        />
      )}
    </div>
  );
}

export const Users = memo(UsersComponent);

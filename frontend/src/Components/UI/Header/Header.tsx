import { JSX, memo } from 'react';
import styles from './Styles.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/Components/UI/Button';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/Api/public/auth';
import { getMe as getPrivateMe } from '@/Api/private/auth';

interface HeaderProps {
  isPublic?: boolean;
}

function HeaderComponent({ isPublic }: HeaderProps): JSX.Element {
  const navigate = useNavigate();
  const { data: me } = useQuery({
    queryFn: isPublic ? getMe : getPrivateMe,
    queryKey: ['me'],
  });

  return (
    <header className={styles.header}>
      <Link className={styles.header__logos} to={'/'}>
        <img className={styles.header__logo} src="/logo.svg" alt="Уральский Федеральный Университет" />
        {/* <img className={styles.header__prohod} src="/prohodLogo.svg" alt="Уральский Федеральный Университет" /> */}
      </Link>
      <div className={styles.header__info}>
        <p>{`${me?.surname} ${me?.name}`}</p>
        {window.location.pathname === '/' || (
          <Button size="s" color="secondary" onClick={() => navigate('/login')}>
            Выйти
          </Button>
        )}
      </div>
    </header>
  );
}

export const Header = memo(HeaderComponent);

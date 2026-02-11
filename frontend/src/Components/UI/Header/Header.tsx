import { JSX, memo } from 'react';
import styles from './Styles.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/Components/UI/Button';

function HeaderComponent(): JSX.Element {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <Link to={'/'}>
        <img className={styles.header__logo} src="/logo.svg" alt="Уральский Федеральный Университет" />
      </Link>
      <Button size="s" color="secondary" onClick={() => navigate('/login')}>
        Выйти
      </Button>
    </header>
  );
}

export const Header = memo(HeaderComponent);

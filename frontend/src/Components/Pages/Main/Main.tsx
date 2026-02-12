import { JSX, memo } from 'react';
import styles from './Styles.module.scss';
import { Button } from '@/Components/UI/Button';
import { Link } from 'react-router-dom';

interface MainProps {
  isPublic?: boolean;
}

function MainComponent({ isPublic }: MainProps): JSX.Element {
  return (
    <div className={styles.main}>
      <h2>Добро пожаловать на платформу ПроХод</h2>
      <p className={styles.main__text}>
        {isPublic
          ? `Сервис создан для избавления гостей от бумажной работы и постоянных согласований, достаточно заполнить заявку на
        сайте и ожидать одобрения в виде QR-кода на указанную почту. Пожалуйста, заполните все поля согласно инструкциям
        на сайте.`
          : `Панель управления процессом согласования разовых пропусков. Мониторинг статусов, верификация данных и управление доступом.`}
      </p>
      <div className={styles.main__buttons}>
        {isPublic && (
          <Link to={'/enter'}>
            <Button>Пройти в ИРИТ-РТФ</Button>
          </Link>
        )}
        <Link to={isPublic ? '/login' : '/admin/login'}>
          <Button color="secondary">{isPublic ? 'Авторизация' : 'Войти в систему'}</Button>
        </Link>
      </div>
    </div>
  );
}

export const Main = memo(MainComponent);

import { JSX, memo } from 'react';
import styles from './Styles.module.scss';

interface CardProps {
  title: string;
  number: string | number;
}

function CardComponent({ title, number }: CardProps): JSX.Element {
  return (
    <div className={styles.card}>
      <p className={styles.card__title}>{title}</p>
      <p className={styles.card__number}>{number}</p>
    </div>
  );
}

export const Card = memo(CardComponent);

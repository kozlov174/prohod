import { memo } from 'react';
import styles from './Styles.module.scss';
import { Button } from '@/Components/UI/Button';
import { Popup } from '@/Components/Layouts/Popup';

type DeletePopupProps = {
  title?: string;
  text: string;
  onClose: () => void;
  onDelete: () => void;
};

const DeletePopupComponent = ({ title, text, onClose, onDelete }: DeletePopupProps) => {
  const deleteItem = async () => {
    onDelete();
    onClose();
  };

  return (
    <Popup>
      <div className={styles.container}>
        <h3 className={styles.container__title}>{title ? title : 'Подтвердите удаление'}</h3>
        <h5 className={styles.container__text}>{text}</h5>
        <div className={styles.container__buttons}>
          <Button size="s" color="red" onClick={deleteItem}>
            Удалить
          </Button>
          <Button size="s" color="secondary" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export const DeletePopup = memo(DeletePopupComponent);

import { JSX, memo } from 'react';
import styles from './Styles.module.scss';
import { Popup } from '@/Components/Layouts/Popup';
import { Button } from '@/Components/UI/Button';

interface DeletePopupProps {
  title?: string;
  text: string;
  onClose: () => void;
  onDelete: () => void;
}

function DeletePopupComponent({ title, text, onClose, onDelete }: DeletePopupProps): JSX.Element {
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
}

export const DeletePopup = memo(DeletePopupComponent);

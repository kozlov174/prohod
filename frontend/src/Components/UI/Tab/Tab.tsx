import { JSX, memo } from 'react';
import styles from './Styles.module.scss';
import { Icon } from '@/Components/UI/Icon';

interface TabProps {
  text: string;
  onClick: (text: string) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  isActive?: boolean;
}

function TabComponent({ text, isActive, onClick, onDelete, onEdit }: TabProps): JSX.Element {
  return (
    <div onClick={() => onClick(text)} className={`${styles.tab} ${isActive && styles.tab_active}`}>
      {text}
      {isActive && onEdit && (
        <button onClick={onEdit} className={styles.tab_trash}>
          <Icon size={24} glyphColor="white" glyph="settings" />
        </button>
      )}
      {isActive && onDelete && (
        <button onClick={onDelete} className={styles.tab_trash}>
          <Icon size={24} glyphColor="red" glyph="delete" />
        </button>
      )}
    </div>
  );
}

export const Tab = memo(TabComponent);

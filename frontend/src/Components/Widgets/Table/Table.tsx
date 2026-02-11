import { JSX, memo } from 'react';
import styles from './Styles.module.scss';
import { Icon } from '@/Components/UI/Icon';

interface TableProps {
  columns: {
    name: string;
    backName: string;
    isSortable?: boolean;
  }[];
  data: { [key: string]: string | React.ReactNode }[];
  onView?: (index: number) => void;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  onSort?: (column: string) => void;
}

function TableComponent({ data, columns, onSort, onView, onEdit, onDelete }: TableProps): JSX.Element {
  if (data.length === 0) {
    return <h2>Нет данных</h2>;
  }
  return (
    <div style={{ gridTemplateColumns: `repeat(${columns.length}, auto)` }} className={styles.table}>
      <div className={styles.table__line}>
        {columns.map(column => (
          <div key={column.name} className={`${styles.table__title}`}>
            <p>{column.name}</p>
            {column.isSortable && (
              <Icon pointer onClick={() => onSort?.(column.backName)} glyph="sort" glyphColor="blue" size={24} />
            )}
          </div>
        ))}
      </div>
      {data.map((el, dataIndex) => (
        <div onClick={onView ? () => onView(dataIndex) : undefined} className={styles.table__line} key={dataIndex}>
          {Object.entries(el).map(([key, value], index) => (
            <div key={key} className={`${styles.table__item}`}>
              {value}
              {index === columns.length - 1 && (
                <div className={styles.table__icons}>
                  {onView && <Icon onClick={() => onView(dataIndex)} pointer glyph="eye" glyphColor="grey" size={24} />}
                  {onEdit && (
                    <Icon
                      onClick={e => {
                        e.stopPropagation();
                        onEdit(dataIndex);
                      }}
                      pointer
                      glyph="settings"
                      glyphColor="grey"
                      size={24}
                    />
                  )}
                  {onDelete && (
                    <Icon
                      onClick={e => {
                        e.stopPropagation();
                        onDelete(dataIndex);
                      }}
                      pointer
                      glyph="delete"
                      glyphColor="red"
                      size={24}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export const Table = memo(TableComponent);

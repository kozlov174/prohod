import { JSX, memo } from 'react';
import styles from './Styles.module.scss';
import { Icon } from '@/Components/UI/Icon';
import { Select } from '@/Components/UI/Select';
import { VIEWS_COUNT } from '@/Components/Widgets/Pagination/const';

interface PaginationProps {
  activeStage: number;
  totalStages: number;
  changeActiveStage: (toStage: number) => void;
  selectedView: number;
  setSelectedView: (toView: number) => void;
}

function PaginationComponent({
  activeStage,
  totalStages,
  selectedView,
  setSelectedView,
  changeActiveStage,
}: PaginationProps): JSX.Element {
  const getActivePaginationItems = (
    totalPages: number,
    currentPage: number,
    maxVisibleItems: number
  ): Array<number | string> => {
    if (totalPages <= 0 || maxVisibleItems <= 0) return [];

    currentPage = Math.max(1, Math.min(currentPage, totalPages));
    maxVisibleItems = Math.min(maxVisibleItems, totalPages);

    if (totalPages <= maxVisibleItems) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: Array<number | string> = [];
    const halfWindow = Math.floor(maxVisibleItems / 2);

    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = startPage + maxVisibleItems - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisibleItems + 1);
    }

    if (currentPage - startPage < 1 && currentPage > 1) {
      startPage = currentPage - 1;
    }
    if (endPage - currentPage < 1 && currentPage < totalPages) {
      endPage = currentPage + 1;
    }

    if (startPage > 1) {
      items.push(1);
      if (startPage > 2) {
        items.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push('...');
      }
      items.push(totalPages);
    }

    const result = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item === '...') {
        const prev = items[i - 1];
        const next = items[i + 1];
        if (prev === currentPage || next === currentPage) continue;
        if (typeof prev === 'number' && typeof next === 'number' && next === prev + 1) continue;
      }
      result.push(item);
    }
    return result;
  };

  if (totalStages < 2) return <></>;

  return (
    <div className={styles.pagination}>
      <div style={{ cursor: activeStage !== 0 ? 'pointer' : 'default' }}>
        <Icon
          size={24}
          glyph="arrowLeft"
          glyphColor={activeStage !== 0 ? 'blue' : 'grey'}
          onClick={() => activeStage !== 0 && changeActiveStage(activeStage - 1)}
        />
      </div>
      {getActivePaginationItems(totalStages, activeStage + 1, 3).map((number, index) =>
        typeof number !== 'string' ? (
          <button
            key={index}
            className={`${styles.pagination__item} ${activeStage === number - 1 && styles.pagination__item_active}`}
            onClick={() => changeActiveStage(number - 1)}
          >
            {number}
          </button>
        ) : (
          <p key={index} className={styles.pagination__item}>
            {number}
          </p>
        )
      )}
      <div style={{ cursor: activeStage !== totalStages - 1 ? 'pointer' : 'default' }}>
        <Icon
          size={24}
          glyph="arrowRight"
          glyphColor={activeStage !== totalStages - 1 ? 'blue' : 'grey'}
          onClick={() => activeStage !== totalStages - 1 && changeActiveStage(activeStage + 1)}
        />
      </div>
      <div className={styles.pagination__select}>
        <p>Показывать на странице</p>
        <Select
          direction="up"
          type="single"
          selectedValue={{ id: selectedView.toString(), value: selectedView }}
          onChange={newValue => setSelectedView(Number(newValue.value))}
          list={VIEWS_COUNT.map(el => ({ id: el.toString(), value: el }))}
        />
      </div>
    </div>
  );
}

export const Pagination = memo(PaginationComponent);

import { ListValue } from '@/Components/UI/Select/types';

export function removeElementAtIndex<T>(array: T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function getListFormObject(object: Record<string, string>): ListValue[] {
  return Object.entries(object).map(([key, value]) => ({
    id: key,
    value: value,
  }));
}

export function convertObjectToListValue<T extends { name: string; id: string }>(
  object: T
): { id: string; value: string } {
  return {
    id: object.id,
    value: object.name,
  };
}

export function createNestedArray<T>(length: number) {
  return Array.from({ length: length }, () => Array.from({ length: length }, () => [] as T[]));
}

export const copyToClipBoard = async (text: string) => {
  await navigator.clipboard.writeText(window.location.origin + `/${text}`);
};

export const pluralize = (count: number, options: Record<number, string>): string => {
  const reminder = count % 10;
  const isTeen = count % 100 >= 11 && count % 100 <= 19;
  const result = count.toString() + ' ';
  if (isTeen) {
    return result + options[5];
  }
  switch (reminder) {
    case 1:
      return result + options[1];
    case 2:
      return result + options[2];
    case 3:
      return result + options[2];
    case 4:
      return result + options[2];
    default:
      return result + options[5];
  }
};

export const formatPrice = (price: number, currency = '') => {
  const result = price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  return result + (currency ? ' ' + currency : '');
};

export const getFilenameFromHeaders = (header: string) => {
  const match = header?.match(/filename\*=UTF-8''([^;]+)/i);
  return match ? decodeURIComponent(match[1]) : `${Date.now()}.xlsx`;
};

export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, sizes.length - 1);
  const formattedSize = parseFloat((bytes / Math.pow(k, index)).toFixed(decimals));
  return formattedSize.toString().replace('.', ',') + ' ' + sizes[index];
}

/**
 * Преобразует ключи объекта из snake_case в camelCase
 * @template T - тип исходного объекта
 * @param obj - объект для преобразования
 * @returns новый объект с преобразованными ключами
 */
export function snakeToCamel<T extends object>(obj: T): object {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Преобразуем snake_case в camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (obj as any)[key];
      result[camelKey] = snakeToCamel(value);
    }
  }
  return result;
}

/**
 * Преобразует ключи объекта из camelCase в snake_case
 * @template T - тип исходного объекта
 * @param obj - объект для преобразования
 * @returns новый объект с преобразованными ключами
 */
export function camelToSnake<T extends object>(obj: T): object {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnake(item));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (obj as any)[key];
      result[snakeKey] = camelToSnake(value);
    }
  }
  return result;
}

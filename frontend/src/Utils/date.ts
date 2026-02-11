import { ListValue } from '@/Components/UI/Select/types';

/**
 * сдвигает неделю на число в аргументе
 * @param week текущая неделя
 * @param weeksToShift число для сдвига
 * @returns Массив из двух элементов с понедельником и воскресеньем в формате Date
 */
export function shiftWeek([startDate, endDate]: Date[], weeksToShift: number) {
  const shiftedStartDate = new Date(startDate);
  const shiftedEndDate = new Date(endDate);

  shiftedStartDate.setDate(shiftedStartDate.getDate() + weeksToShift * 7);
  shiftedEndDate.setDate(shiftedEndDate.getDate() + weeksToShift * 7);

  return [shiftedStartDate, shiftedEndDate];
}

/**
 * перевод даты в строку dd.mm
 * @param date Date
 * @returns строка вида dd.mm
 */
export function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
}

/**
 * перевод даты в строку yyyy-dd-mm
 * @param date Date | string
 * @returns строка вида yyyy-dd-mm
 */
export function formatDateUTC(oldDate: Date | string) {
  const date = typeof oldDate === 'string' ? new Date(oldDate) : oldDate;
  const year = date.getFullYear();
  let month = String(date.getMonth() + 1);
  month = month.length === 1 ? '0' + month : month;
  let day = String(date.getDate());
  day = day.length === 1 ? '0' + day : day;
  return `${year}-${month}-${day}`;
}

/**
 * получение массива дат в формате yyyy-mm-dd по дате начала и дате конца
 * @param days дата начала и дата конца формате [Date, Date]
 * @returns массив дат в формате yyyy-mm-dd
 */
export function generateDateStrings([startDate, endDate]: Date[]) {
  const result = [];
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    result.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    );
  }
  return result;
}

/**
 * удаление года из даты формата yyyy-mm-dd и получение даты в формате dd.mm
 * @param dateStr дата начала и дата конца формате [Date, Date]
 * @returns дата в формате dd.mm
 */
export function getWeekDayAndDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${day}.${month}`;
}

/**
 * по дате формата yyyy-mm-dd получение массива формата [номер дня, навзание месяца, название дня недели]
 * @param dateString дата в формате yyyy-mm-dd
 * @returns массив формата [номер дня, навзание месяца, название дня недели]
 */
export function getDayAndWeekday(dateString: string) {
  const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const weekdayIndex = date.getDay();

  return [day + ' ' + months[monthIndex], daysOfWeek[weekdayIndex]];
}

/**
 * преобразование значения даты из input:type=date в формат yyyy-mm-dd
 * @param dateString дата в значении input
 * @returns дата в формате yyyy-mm-dd
 */
export function getInputDate(dateString: string) {
  const date = new Date(dateString);
  return formatDateUTC(date);
}

/**
 * получение текущего времени в формате YYYY-MM-DDTHH:mm:ss
 * @returns время в формате YYYY-MM-DDTHH:mm:ss
 */
export function getUTCCurrentDate() {
  const date = new Date();

  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * удаление секунд из времени формата hh:mm:ss
 * @param time время в формате hh:mm:ss
 * @returns время в формате hh:mm
 */
export const getPrettyTime = (time: string) => {
  return time.slice(0, time.length - 3);
};

export const getPrettyDate = (date: string) => {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${day}.${month}.${year}`;
};

/**
 * получение времени по дате
 * @param isoString дата в формате YYYY-MM-DDTHH:mm:ss
 * @returns время в формате hh:mm
 */
export function convertTime(isoString: string) {
  const timePart = isoString.split('T')[1];
  return timePart.substring(0, 5);
}

/**
 * преобразование формата даты
 * @param date дата в формате YYYY-MM-DD
 * @returns дата в формате dd.mm.yyyy
 */
export function convertDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

/**
 * получение массива дней в неделе по понедельнику и воскресенью
 * @param days массив с воскресеньем и понедельником
 * @returns массив c датами недели
 */
export function getAllWeekDates([monday, sunday]: Date[]): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(monday.getTime());
  while (currentDate <= sunday) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

/**
 * конвертация локального времени во время по гринвичу (UTC)
 * @param timeStr локальное время в формате hh:mm:ss
 * @returns время по гринвичу в формате hh:mm:ss.000Z
 */
export function convertTimeToUTC(timeStr: string): string {
  // Проверка формата строки
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  if (!timeRegex.test(timeStr)) {
    throw new Error('Invalid time format. Use hh:mm:ss');
  }

  // Разбиение на компоненты
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);

  // Создание объекта Date с текущей датой и локальным временем
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);

  // Получение UTC-компонентов
  const utcHours = date.getUTCHours().toString().padStart(2, '0');
  const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');
  const utcSeconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${utcHours}:${utcMinutes}:${utcSeconds}.000Z`;
}

function convertTimeWithZToUTC(timeStr: string): string {
  const times = timeStr.split('.');
  return times[0];
}
/**
 * конвертация времени по гринвичу в локальное время
 * @param utcTime время по гринвичу в формате hh:mm:ss.000Z или hh:mm:ss
 * @returns локальное время в формате hh:mm:ss.000Z
 */
export function convertUTCToLocalTime(utcTime: string): string {
  // Проверка формата UTC-времени
  let time = utcTime;
  if (utcTime[utcTime.length - 1] === 'Z') {
    time = convertTimeWithZToUTC(utcTime);
  }

  // Разбиваем на компоненты
  const [hours, minutes, seconds] = time.split(':').map(Number);

  // Создаем дату с текущими UTC-компонентами
  const date = new Date();
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(seconds);

  // Получаем локальное время
  const localHours = date.getHours().toString().padStart(2, '0');
  const localMinutes = date.getMinutes().toString().padStart(2, '0');
  const localSeconds = date.getSeconds().toString().padStart(2, '0');
  return `${localHours}:${localMinutes}:${localSeconds}`;
}

/**
 * Преобразует дату в формате ISO 8601 (YYYY-MM-DDTHH:mm:ss) в локальное время в формате hh:mm:ss
 * @param dateString Строка с датой в формате YYYY-MM-DDTHH:mm:ss
 * @returns Строка времени в формате hh:mm:ss в локальной временной зоне
 */
export function convertToLocalTime(isoDate: string): string {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid ISO date string');
  }

  // Используем локальные методы для получения времени
  const localHours = date.getHours().toString().padStart(2, '0');
  const localMinutes = date.getMinutes().toString().padStart(2, '0');

  return `${localHours}:${localMinutes}`;
}

/**
 * Извлекает время из Date объекта в формате hh:mm
 * @param date - Дата, из которой нужно извлечь время
 * @returns Строка времени в формате hh:mm (24-часовой формат)
 */
export function extractTimeFromDate(date: Date): string {
  // Получаем часы и минуты
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Возвращаем в формате hh:mm
  return `${hours}:${minutes}`;
}

/**
 * Возвращает индекс месяца по дате
 * @param date - дата в формате yyyy-mm-dd
 * @returns индекс месяца
 */
export const getMonthIndexFromDate = (date: string) => {
  const month = Number(date.split('-')[1]);
  return month - 1;
};

/**
 * Возвращает List для Select последние 4 года
 * @returns ListValue[]
 */
export function getListValuesLastFourYears(): ListValue[] {
  return Array.from({ length: 5 }, (_, index) => ({
    id: String(new Date().getFullYear() - index),
    value: String(new Date().getFullYear() - index),
  }));
}

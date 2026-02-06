/**
 * Регулярное выражение для проверки email
 * Проверяет:
 * - Наличие @ и домена
 * - Корректность символов до @
 * - Корректность домена
 * - Наличие поддомена (опционально)
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * Проверяет, является ли строка корректным email адресом
 * @param email - Строка для проверки
 * @returns boolean - true если email корректный, false в противном случае
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email)
}

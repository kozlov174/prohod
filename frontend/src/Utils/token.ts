import { TokenData } from '@/Models/Auth/client';

export function getTokenFromCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setTokensToCookies(
  value: string,
  name: 'access' | 'refresh',
  props: { [key: string]: string | number | Date | boolean } = {},
  isOnlySession: boolean = false
) {
  props = {
    path: '/',
    ...props,
  };

  // Если флаг isOnlySession=true, не устанавливаем expires
  if (!isOnlySession) {
    let exp = props.expires;
    if (exp === undefined) {
      const tokenData = parseJwt(value);
      if (tokenData) {
        exp = new Date();
        exp.setHours(exp.getHours() + 1);
      }
    }
    if (exp && typeof exp === 'number') {
      const d = new Date();
      d.setTime(d.getTime() + exp * 1000);
      exp = props.expires = d;
    }

    if (exp && exp instanceof Date) {
      props.expires = exp.toUTCString();
    }
  } else {
    // Для сессионной куки удаляем expires
    delete props.expires;
  }

  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function removeTokensFromCookies(tokenType: 'access' | 'refresh') {
  setTokensToCookies('', `${tokenType}`, { expires: -1 });
}

export function parseJwt(token: string | undefined): TokenData | null {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
}

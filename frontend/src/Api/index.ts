import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { getTokenFromCookie, setTokensToCookies } from '../Utils/token';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { updateToken } from '@/Api/auth';
import { logoutUser } from '@/Utils/auth';
import { camelToSnake, snakeToCamel } from '@/Utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const notify = (message: string) => toast(message);

export const PagesURl = {
  ACCOUNTS: '/accounts',
  USER: '/users',
  VISIT_FOR_USERS: '/visit-requests-for-users/visit-requests',
  VERIFY_EMAIL: '/users/verify_email',
};

const REQUEST_TIMEOUT = 10000;

const instance = axios.create({
  baseURL: BACKEND_URL,
  timeout: REQUEST_TIMEOUT,
});

const requestInterceptors = {
  onSuccess: (config: InternalAxiosRequestConfig) => {
    config.timeout = REQUEST_TIMEOUT;

    config.headers.Authorization = config.headers.Authorization
      ? config.headers.Authorization
      : 'Bearer ' + getTokenFromCookie('access');

    if (config.params) {
      config.params = camelToSnake(config.params);
    }

    if (config.data) {
      config.data = camelToSnake(config.data);
    }
    return config;
  },
  onError: (error: Error) => Promise.reject(error),
};

const responseInterceptors = {
  onSuccess: (response: AxiosResponse) => {
    if (response.data && response.headers['content-type']?.includes('application/json')) {
      response.data = snakeToCamel(response.data);
    }
    return response;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: async (error: any) => {
    // Обработка ошибок по статусам
    switch (error.response?.status) {
      case 400:
        if (error.response?.data?.detail) {
          notify(error.response.data.detail);
        }
        break;
      case 403:
        toast('Ошибка доступа');
        window.location.href = '/';
        break;
      case 409:
        if (error.response?.data?.detail) {
          notify(error.response.data.detail);
        }
        break;
      default:
        break;
    }

    return Promise.reject(error);
  },
};

async function refreshAccessToken() {
  try {
    const refreshToken = getTokenFromCookie('refresh');
    if (!refreshToken) {
      window.location.pathname = '/login';
      return;
    }
    const response = await updateToken(refreshToken);
    setTokensToCookies(response.accessToken, 'access');
    setTokensToCookies(response.refreshToken, 'refresh');
    return '';
  } catch {
    logoutUser();
    window.location.href = '/login';
  }
}

instance.interceptors.request.use(requestInterceptors.onSuccess, requestInterceptors.onError);

createAuthRefreshInterceptor(instance, refreshAccessToken, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});

instance.interceptors.response.use(responseInterceptors.onSuccess, responseInterceptors.onError);

export default instance;

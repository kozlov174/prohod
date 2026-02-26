import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { getTokenFromCookie } from '../Utils/token';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { logoutUser } from '@/Utils/auth';
import { camelToSnake, snakeToCamel } from '@/Utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL_PUBLIC || 'http://localhost:8000';
const PRIVATE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL_PRIVATE || 'http://localhost:8000';

const notify = (message: string) => toast(message);

export const PagesURl = {
  ACCOUNTS: '/accounts',
  USER: '/users',
  VISIT_FOR_USERS: '/visit-requests-for-users/visit-requests/',
  VISIT_FOR_SECURITY: '/visit-requests-for-security/visit-requests/',
  VERIFY_EMAIL: '/users/verify_email',
  REPORT: '/reports',
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
  logoutUser();
  window.location.href = '/login';
}

instance.interceptors.request.use(requestInterceptors.onSuccess, requestInterceptors.onError);

createAuthRefreshInterceptor(instance, refreshAccessToken, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});

instance.interceptors.response.use(responseInterceptors.onSuccess, responseInterceptors.onError);

export const privateInstance = axios.create({
  baseURL: PRIVATE_BACKEND_URL,
  timeout: REQUEST_TIMEOUT,
});

privateInstance.interceptors.request.use(requestInterceptors.onSuccess, requestInterceptors.onError);
privateInstance.interceptors.response.use(responseInterceptors.onSuccess, responseInterceptors.onError);

createAuthRefreshInterceptor(privateInstance, refreshAccessToken, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});

export default instance;

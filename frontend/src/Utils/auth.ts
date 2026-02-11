import { removeTokensFromCookies } from '@/Utils/token';

export const logoutUser = () => {
  removeTokensFromCookies('access');
  removeTokensFromCookies('refresh');
};

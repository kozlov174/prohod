const TOKEN_KEY_NAME = 'token'

export const getToken = () => localStorage.getItem(TOKEN_KEY_NAME)

export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY_NAME, token)

export const removeToken = () => localStorage.removeItem(TOKEN_KEY_NAME)

const USER_KEY_NAME = 'user'

export const getUser = () => localStorage.getItem(USER_KEY_NAME)

export const setUser = (user: string) =>
  localStorage.setItem(USER_KEY_NAME, user)

export const removeUser = () => localStorage.removeItem(USER_KEY_NAME)

const USER_LOGIN_KEY_NAME = 'user_login'

export const getUserLogin = () => localStorage.getItem(USER_LOGIN_KEY_NAME)

export const setUserLogin = (login: string) =>
  localStorage.setItem(USER_LOGIN_KEY_NAME, login)

export const removeUserLogin = () => localStorage.removeItem(USER_LOGIN_KEY_NAME)
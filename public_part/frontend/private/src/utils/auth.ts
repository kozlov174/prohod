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

const LOGIN_KEY_NAME = 'login'

export const getLogin = () => localStorage.getItem(LOGIN_KEY_NAME)

export const setLogin = (login: string) =>
  localStorage.setItem(LOGIN_KEY_NAME, login)

export const removeLogin = () => localStorage.removeItem(LOGIN_KEY_NAME)
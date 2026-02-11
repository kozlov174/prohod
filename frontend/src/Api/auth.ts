import instance, { PagesURl } from '@/Api';
import {
  CreateUserRequest,
  EditUserRequest,
  GetAllUsersRequest,
  GetAllUsersResponse,
  LoginRequest,
  LoginResponse,
  User,
} from '@/Models/Auth/api';

/**
 * Logs in the user with the provided login data
 * @param {LoginRequest} data - The login data
 * @returns {Promise<LoginResponse>} - The login response
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await instance.post<LoginResponse>(PagesURl.USER + '/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
}

/**
 * Updates the user's access token with the provided refresh token
 * @param {string} refreshToken - The refresh token to use for updating the access token
 * @returns {Promise<LoginResponse>} - The updated access token
 */

export async function updateToken(refreshToken: string): Promise<LoginResponse> {
  const { data } = await instance.post<LoginResponse>(PagesURl.USER + '/token', {
    refresh_token: refreshToken,
  });
  return data;
}

export async function restorePassword(email: string) {
  const response = await instance.post(PagesURl.USER + '/restore-password', { email });
  return response.data;
}

/**
 * Gets the current user's information
 * @returns {Promise<User>} - The current user's information
 */

export async function getMe(): Promise<User> {
  return (await instance.get(PagesURl.USER + '/me')).data;
}

/**
 * Gets the permissions of the current user
 * @returns {Promise<string[]>} - The current user's permissions
 */

export async function getMePermissions(): Promise<string[]> {
  return (await instance.get(PagesURl.USER + '/me/permissions')).data;
}

export async function getMePages() {
  return (await instance.get(PagesURl.USER + '/me/pages')).data;
}

/**
 * Updates the current user's password with the provided password
 * @param {string} password - The new password
 * @returns {Promise<User>} - The updated user
 */

/**
 * Updates the current user's password with the provided password
 * @param {string} password - The new password
 * @returns {Promise<User>} - The updated user
 */
export async function updateMePassword(password: string): Promise<User> {
  return (await instance.post(PagesURl.USER + '/me/update_password', { password })).data;
}

/**
 * Gets all users with the given filters
 * @param {GetAllUsersRequest} filters - The filters to apply
 * @returns {Promise<GetAllUsersResponse>} - The users with the given filters
 */
export async function getAllUsers(filters?: GetAllUsersRequest): Promise<GetAllUsersResponse> {
  return (await instance.post<GetAllUsersResponse>(PagesURl.USER + '/all', { ...filters }, { params: { ...filters } }))
    .data;
}

/**
 * Gets a user by the given id
 * @param {string} id - The id of the user to get
 * @returns {Promise<User>} - The user with the given id
 */
export async function getUserById(id: string): Promise<User> {
  return (await instance.get<User>(PagesURl.USER + `/${id}`)).data;
}

/**
 * Edits a user with the given id and data
 * @param {string} id - The id of the user to edit
 * @param {EditUserRequest} data - The data to edit the user with
 * @returns {Promise<User>} - The edited user
 */
export async function editUser(id: string, data: EditUserRequest): Promise<User> {
  return (await instance.patch(PagesURl.USER + `/${id}`, data)).data;
}

/**
 * Deletes a user with the given id
 * @param {string} id - The id of the user to delete
 * @returns {Promise<void>} - The result of the deletion
 */
export async function deleteUser(id: string): Promise<void> {
  return (await instance.delete(PagesURl.USER + `/${id}`)).data;
}

/**
 * Creates a new user with the given data
 * @param {CreateUserRequest} data - The data to create the user with
 * @returns {Promise<User>} - The created user
 */
export async function createUser(data: CreateUserRequest): Promise<User> {
  return (await instance.post(PagesURl.USER, data)).data;
}

/**
 * Updates the password of a user with the given id
 * @param {string} id - The id of the user to update the password of
 * @param {string} password - The new password
 * @returns {Promise<User>} - The updated user
 */
export async function updatePasswordById(id: string, password: string): Promise<User> {
  return (await instance.post(PagesURl.USER + `/${id}/update_password`, { password })).data;
}

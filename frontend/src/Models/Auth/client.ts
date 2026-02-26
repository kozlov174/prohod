export type TokenData = {
  role: UserRole;
  user_id: string;
};

export type UserRole = 'user' | 'security' | 'admin';

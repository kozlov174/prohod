export type TokenData = {
  device_id: string;
  exp: number;
  type_token: 'access' | 'refresh';
  user_id: string;
};

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'main_resp'
  | 'resp_core'
  | 'resp_institute'
  | 'resp_direction'
  | 'resp_block_course'
  | 'resp_reading_division'
  | 'resp_teacher'
  | 'tutor'
  | 'scheduler_manager'
  | 'viewer';

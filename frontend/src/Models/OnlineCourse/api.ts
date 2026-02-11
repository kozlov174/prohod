import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type Course = {
  id: string;
  name: string;
  link: string;
  isActive: string;
  createdAt: string;
  updatedAt?: string;
};

export type GetCoursesRequest = Filter;
export type GetCoursesResponse = List<Course>;

export type CreateCourseRequest = {
  name: string;
  link: string;
  isActive?: boolean;
};

export type EditCourseRequest = Partial<CreateCourseRequest>;

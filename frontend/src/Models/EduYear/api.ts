import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type EduYear = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type GetAllEduYearRequest = Filter;
export type GetAllEduYearResponse = List<EduYear>;

export type CreateEduYearRequest = Omit<EduYear, 'id' | 'createdAt' | 'updatedAt'>;
export type EditEduYearRequest = Partial<CreateEduYearRequest>;

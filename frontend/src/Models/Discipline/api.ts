import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type Discipline = {
  id: string;
  name: string;
  code: string;
  idEduYear: string;
  isActive: boolean;
  isCore: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetDisciplinesResponse = List<Discipline>;
export type GetDisciplinesRequest = Filter;

export type CreateDisciplineRequest = {
  name: string;
  code: string;
  isCore: boolean;
};

export type EditDisciplineRequest = Partial<CreateDisciplineRequest>;

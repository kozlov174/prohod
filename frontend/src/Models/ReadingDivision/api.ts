import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type Division = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetDivisionsRequest = Filter;
export type GetDivisionsResponse = List<Division>;

export type CreateDivisionRequest = {
  name: string;
};
export type EditDivisionRequest = Partial<CreateDivisionRequest>;

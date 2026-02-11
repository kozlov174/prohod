import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type Partner = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type GetAllPartnersRequest = Filter;

export type GetAllPartnersResponse = List<Partner>;

export type CreatePartnersRequest = {
  name: string;
  isActive?: boolean;
};

export type EditPartnersRequest = Partial<CreatePartnersRequest>;

import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type Institute = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
};

export type GetInstitutesRequest = Filter<{
  idsInstitute: string[];
  idsDirection: string[];
  idsProgram: string[];
}>;
export type GetInstitutesResponse = List<Institute>;

export type CreateInstituteRequest = {
  name: string;
};

export type EditInstituteRequest = Partial<{
  name: string;
}>;

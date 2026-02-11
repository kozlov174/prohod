import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type Direction = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  institute: {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
  };
  createdAt: string;
  updatedAt?: string;
};

export type GetAllDirectionRequest = Filter<{
  idsInstitute: string[];
  idsDirection: string[];
  idsProgram: string[];
}>;
export type GetAllDirectionResponse = List<Direction>;

export type CreateDirectionRequest = {
  idInstitute: string;
  name: string;
  code: string;
  isActive: boolean;
};
export type EditDirectionRequest = Partial<CreateDirectionRequest>;

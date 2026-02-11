import { Institute } from '@/Models/Institute/api';
import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type Program = {
  id: string;
  name: string;
  direction: {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    institute: Institute;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetProgramsRequest = Filter<{
  idsInstitute: string[];
  idsDirection: string[];
  idsProgram: string[];
}>;
export type GetProgramsResponse = List<Program>;

export type CreateProgramRequest = {
  name: string;
  idDirection: string;
};

export type EditProgramRequest = Partial<CreateProgramRequest>;

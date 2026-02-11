import { Direction } from '@/Models/Direction/api';
import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type AcademGroup = {
  id: string;
  idEduYear: string;
  name: string;
  numberCourse: number;
  budget?: number;
  contract?: number;
  isActive: boolean;
  program: {
    id: string;
    direction: Direction;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
  };
  createdAt: string;
  updatedAt?: string;
};

export type GetAcademGroupsRequest = { idEduYear: string } & Filter<{
  idEduYear: string;
  numberCourses: number[];
  idsInstitute: string[];
  idsDirection: string[];
  idsProgram: string[];
}>;
export type GetAcademGroupsResponse = List<AcademGroup>;

export type CreateAcademGroupRequest = {
  idProgram: string;
  idEduYear: string;
  numberCourse: number;
  name: string;
  budget?: number;
  contract?: number;
};

export type EditAcademGroupRequest = Partial<{
  name: string;
  idSpecialty: string;
  idCourse: string;
  budget: number;
  contract: number;
}>;

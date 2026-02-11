import { Discipline } from '@/Models/Discipline/api';
import { ExamType } from '@/Models/Mup/client';
import { Program } from '@/Models/Program/api';
import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type DisciplineProgram = {
  id: string;
  idEduYear: string;
  lecHours: number;
  prHours: number;
  labHours: number;
  onlineHours: number;
  krHours: number;
  semestr: number;
  creditUnits: number;
  typeFinal: ExamType;
  discipline: Discipline;
  program: Program;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type GetAllDisciplineProgramRequest = { idEduYear: string } & Filter<{
  numberCourses: number[];
  idsInstitute: string[];
  idsDirection: string[];
  idsProgram: string[];
}>;
export type GetAllDisciplineProgramResponse = List<DisciplineProgram>;

export type CreateDisciplineProgramRequest = Omit<
  DisciplineProgram,
  'id' | 'createdAt' | 'updatedAt' | 'program' | 'discipline'
> & {
  idDiscipline: string;
  idProgram: string;
};
export type EditDisciplineProgramRequest = Partial<CreateDisciplineProgramRequest>;

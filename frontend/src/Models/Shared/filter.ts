export type Filter<T = object> = Partial<{
  search: string;
  sortBy: string;
  desc: number;
  page: number;
  imit: number;
}> &
  Partial<T>;

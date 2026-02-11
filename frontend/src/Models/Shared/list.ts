export type List<T> = {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecord: number;
  content: T[];
};

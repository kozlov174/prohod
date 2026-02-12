export function paginateArray<T>(array: T[], page: number, perPage: number) {
  const start = (page - 1) * perPage;
  return array.slice(start, start + perPage);
}
export function searchArray<T extends object>(array: T[], searchTerm: string) {
  if (!searchTerm) return array;

  return array.filter(item =>
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );
}
export function getPaginatedData<T extends object>(
  array: T[],
  activePage: number,
  activeViews: number,
  search: string
) {
  const filtered = searchArray(array, search);
  return paginateArray(filtered, activePage, activeViews);
}

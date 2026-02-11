export function getSortValueByOld(oldValue: -1 | 0 | 1) {
  if (oldValue === -1) return 0;
  if (oldValue === 0) return 1;
  return 0;
}

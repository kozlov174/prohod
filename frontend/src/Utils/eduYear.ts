export const setEduYearToStorage = (eduYearId: string) => {
  localStorage.setItem('eduYear', eduYearId);
};

export const getEduYearFromStorage = () => {
  return localStorage.getItem('eduYear');
};

export const removeEduYearFromStorage = () => {
  localStorage.removeItem('eduYear');
};

import { createContext } from 'react';

interface TPermission {
  user: null;
}

export const PermissionContext = createContext<TPermission>({
  user: null,
});

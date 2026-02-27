import { createContext } from 'react';

interface TPermission {
  isPublic: boolean;
}

export const PermissionContext = createContext<TPermission>({
  isPublic: true,
});

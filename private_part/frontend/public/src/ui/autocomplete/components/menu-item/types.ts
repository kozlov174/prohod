import React from 'react'

export type MenuItemBaseProps = {
  active: boolean;
};

export type MenuItemProps = MenuItemBaseProps &
  React.HTMLAttributes<HTMLDivElement>;

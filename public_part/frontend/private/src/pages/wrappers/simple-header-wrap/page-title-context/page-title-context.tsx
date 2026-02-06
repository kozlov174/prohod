import React from 'react'

import { SimpleHeaderWrap } from '../simple-header-wrap'

export type PageTitleContextProps = {
  setTitle?: (title: React.ReactNode) => void;
  resetTitle?: () => void;
  title?: React.ReactNode;
};

export const PageTitleContext = React.createContext<PageTitleContextProps>({})

export function PageTitleProvider({ children }: React.PropsWithChildren) {
  const [title, setTitle] = React.useState<React.ReactNode>()

  const resetTitle = React.useCallback(() => setTitle(undefined), [])

  return (
    <PageTitleContext.Provider value={{ setTitle, resetTitle, title }}>
      <SimpleHeaderWrap title={title}>{children}</SimpleHeaderWrap>
    </PageTitleContext.Provider>
  )
}

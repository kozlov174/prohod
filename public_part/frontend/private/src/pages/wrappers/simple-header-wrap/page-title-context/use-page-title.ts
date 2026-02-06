import React, { useEffect } from 'react'

import { PageTitleContext } from './page-title-context'

export function usePageTitle(props?: { initialTitle?: React.ReactNode }) {
  const context = React.useContext(PageTitleContext)

  if (!context) {
    throw new Error(
      'usePageTitleContext must be used within a PageTitleProvider'
    )
  }

  useEffect(() => {
    if (props?.initialTitle) {
      context.setTitle?.(props.initialTitle)
    }

    return () => {
      context.resetTitle?.()
    }
  }, [])

  return context
}

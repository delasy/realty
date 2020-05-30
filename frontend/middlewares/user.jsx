import React from 'react'
import _ from 'lodash'

import withAuth from '~/middlewares/auth'
import { apolloHelpers } from '~/middlewares/apollo'

export default _.flowRight(withAuth, (PageComponent) => {
  const withUser = (props) => {
    return (
      <PageComponent {...props} />
    )
  }

  withUser.getInitialProps = async (ctx) => {
    if (ctx.user === null) {
      await apolloHelpers.onSignoutRedirect(ctx)
      return {}
    }

    let pageProps = {}

    if (PageComponent.getInitialProps) {
      pageProps = await PageComponent.getInitialProps(ctx)
    }

    return pageProps
  }

  return withUser
})

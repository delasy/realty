import React from 'react'
import _ from 'lodash'

import GET_CURRENT_USER from '~/graphql/queries/get-current-user'
import withApollo, { apolloHelpers } from '~/middlewares/apollo'

export default _.flowRight(withApollo, (PageComponent) => {
  const withAuth = (props) => {
    return (
      <PageComponent {...props} />
    )
  }

  withAuth.getInitialProps = async (ctx) => {
    ctx.user = null

    if (apolloHelpers.getToken(ctx)) {
      const { query } = ctx.apolloClient

      try {
        const res = await query({
          fetchPolicy: 'network-only',
          query: GET_CURRENT_USER
        })

        ctx.user = res.data.currentUser
      } catch {
        await apolloHelpers.onSignout(ctx)
      }
    }

    let pageProps = {}

    if (PageComponent.getInitialProps) {
      pageProps = await PageComponent.getInitialProps(ctx)
    }

    return {
      ...pageProps,
      user: ctx.user
    }
  }

  return withAuth
})

import withUser from '~/middlewares/user'
import { apolloHelpers } from '~/middlewares/apollo'

const AuthSignoutPage = () => {
  return null
}

AuthSignoutPage.getInitialProps = async (ctx) => {
  await apolloHelpers.onSignout(ctx)
  return {}
}

export default withUser(AuthSignoutPage)

const jwt = require('jsonwebtoken')
const _ = require('lodash')
const {
  AuthenticationError,
  SchemaDirectiveVisitor,
  makeExecutableSchema,
  gql
} = require('apollo-server-express')

const { User } = require('../models')

module.exports.context = async ({ req }) => {
  const ctx = {
    app: req.app,
    user: null
  }

  const { authorization = '' } = req.headers

  if (authorization === '') {
    return ctx
  }

  const token = authorization.replace('Bearer ', '')

  try {
    const { userId } = await jwt.verify(token, process.env.SECRET)
    const user = await User.findByPk(userId)

    if (user !== null) {
      return { ...ctx, user }
    }
  } catch {
  }

  throw new AuthenticationError('Invalid token')
}

const initialTypeDefs = gql`
  directive @guest on FIELD | FIELD_DEFINITION
  directive @user on FIELD | FIELD_DEFINITION

  scalar DateTime

  type Mutation
  type Query
`

const resolvers = []
const typeDefs = [initialTypeDefs]

const nodes = [
  require('./connection'),
  require('./node'),
  require('./property'),
  require('./user')
]

for (const node of nodes) {
  if (Object.prototype.hasOwnProperty.call(node, 'resolvers')) {
    resolvers.push(node.resolvers)
  }

  if (Object.prototype.hasOwnProperty.call(node, 'typeDefs')) {
    typeDefs.push(node.typeDefs)
  }
}

class GuestDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve } = field

    field.resolve = function (root, args, ctx, info) {
      if (ctx.user !== null) {
        throw new AuthenticationError('Authorized')
      }

      return resolve.call(this, root, args, ctx, info)
    }
  }
}

class UserDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const { resolve } = field

    field.resolve = function (root, args, ctx, info) {
      if (ctx.user === null) {
        throw new AuthenticationError('Unauthorized')
      }

      return resolve.call(this, root, args, ctx, info)
    }
  }
}

module.exports.schema = makeExecutableSchema({
  inheritResolversFromInterfaces: true,
  resolvers: _.merge(...resolvers),
  schemaDirectives: {
    guest: GuestDirective,
    user: UserDirective
  },
  typeDefs: typeDefs
})

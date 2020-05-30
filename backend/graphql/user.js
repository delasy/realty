const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { UserInputError, gql } = require('apollo-server-express')

const { User } = require('../models')

module.exports.typeDefs = gql`
  type AuthenticateUserPayload {
    token: String!
  }

  type CurrentUser implements Node {
    createdAt: DateTime!
    databaseId: UUID!
    deletedAt: DateTime
    email: String!
    firstName: String!
    id: ID!
    lastName: String!
    updatedAt: DateTime!
  }

  type User implements Node {
    createdAt: DateTime!
    databaseId: UUID!
    deletedAt: DateTime
    firstName: String!
    id: ID!
    lastName: String!
    updatedAt: DateTime!
  }

  extend type Mutation {
    authenticateUser (
      input: AuthenticateUserInput!
    ): AuthenticateUserPayload! @guest
  }

  extend type Query {
    currentUser: CurrentUser! @user
  }

  input AuthenticateUserInput {
    email: String!
    password: String!
  }
`

module.exports.resolvers = {
  Mutation: {
    authenticateUser: async (parent, args) => {
      const { email, password } = args.input

      if (!validator.isEmail(email)) {
        throw new UserInputError('Invalid email', {
          invalidArgs: ['email']
        })
      } else if (!validator.isLength(password, { min: 6 })) {
        throw new UserInputError('Invalid password', {
          invalidArgs: ['password']
        })
      }

      const user = await User.findOneByEmail(email)

      if (user === null) {
        throw new UserInputError('Invalid email or password', {
          invalidArgs: ['email', 'password']
        })
      }

      const passwordsMatch = await bcrypt.compare(password, user.password)

      if (!passwordsMatch) {
        throw new UserInputError('Invalid email or password', {
          invalidArgs: ['email', 'password']
        })
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
        expiresIn: '7d'
      })

      return { token }
    }
  },
  Query: {
    currentUser: (parent, args, ctx) => {
      return ctx.user
    }
  }
}

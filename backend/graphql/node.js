const validator = require('validator')
const _ = require('lodash')
const { GraphQLScalarType, Kind } = require('graphql')
const { UserInputError, gql } = require('apollo-server-express')

const models = require('../models')

module.exports.typeDefs = gql`
  interface Node {
    databaseId: UUID!
    id: ID!
  }

  extend type Query {
    node (id: ID!): Node! @user
  }

  scalar UUID
`

const uuidValue = (value) => {
  const uuid = value.toLowerCase()

  if (!validator.isUUID(uuid, 4)) {
    return null
  }

  return uuid
}

module.exports.resolvers = {
  Node: {
    databaseId: (parent) => {
      return parent.id
    },
    id: (parent, args, ctx, info) => {
      return encodeId(info.parentType, parent.id)
    },
    __resolveType: (parent) => {
      return _.upperFirst(parent._modelOptions.name.singular)
    }
  },
  Query: {
    node: async (parent, args) => {
      const { __typename, id } = decodeIdAndCheck(args.id)
      const Model = models[__typename]

      if (typeof Model === 'undefined') {
        throw new UserInputError('Invalid id', {
          invalidArgs: ['id']
        })
      }

      return Model.findByPk(id)
    }
  },
  UUID: new GraphQLScalarType({
    name: 'UUID',
    parseLiteral (ast) {
      if (ast.kind === Kind.STRING) {
        return uuidValue(ast.value)
      }

      return null
    },
    parseValue: uuidValue,
    serialize: uuidValue
  })
}

const decodeId = (id) => {
  const parts = Buffer.from(id, 'base64').toString('utf8').split(':')

  return {
    id: parts[1],
    __typename: parts[0]
  }
}

const decodeIdAndCheck = (id, fieldName = 'id') => {
  const data = decodeId(id)

  if (!validator.isUUID(data.id, 4)) {
    throw new UserInputError('Invalid ' + fieldName, {
      invalidArgs: [fieldName]
    })
  }

  return data
}

const encodeId = (modelName, id) => {
  return Buffer.from(modelName + ':' + id, 'utf8').toString('base64')
}

module.exports.decodeId = decodeId
module.exports.decodeIdAndCheck = decodeIdAndCheck
module.exports.encodeId = encodeId

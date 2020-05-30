const validator = require('validator')
const { UserInputError, gql } = require('apollo-server-express')

const { Property } = require('../models')
const { buildConnection } = require('./connection')
const { decodeIdAndCheck } = require('./node')

module.exports.typeDefs = gql`
  type Property implements Node {
    createdAt: DateTime!
    databaseId: UUID!
    deletedAt: DateTime
    name: String!
    notes: String!
    id: ID!
    updatedAt: DateTime!
    user: User!
  }

  extend type Mutation {
    createProperty (input: CreatePropertyInput!): Property! @user
    deleteProperty (id: ID!): Property! @user
    duplicateProperty (id: ID!): Property! @user
    updateProperty (id: ID!, input: UpdatePropertyInput!): Property! @user
  }

  extend type Query {
    properties (
      after: ID
      before: ID
      first: Int
      last: Int
      orderBy: PropertyOrder = {
        direction: DESC
        field: UPDATED_AT
      }
    ): Connection! @user
  }

  enum PropertyOrderField {
    NAME
    CREATED_AT
    UPDATED_AT
  }

  input CreatePropertyInput {
    name: String!
    notes: String!
  }

  input PropertyOrder {
    direction: OrderDirection!
    field: PropertyOrderField!
  }

  input UpdatePropertyInput {
    name: String!
    notes: String!
  }
`

module.exports.resolvers = {
  Mutation: {
    createProperty: async (parent, args, ctx) => {
      const { name, notes } = args.input

      if (!validator.isLength(name, { min: 1, max: 255 })) {
        throw new UserInputError('Invalid name', {
          invalidArgs: ['name']
        })
      }

      const node = Property.build({
        userId: ctx.user.id,
        name: name.trim(),
        notes: notes
      })

      const isNameUnique = await node.checkUniqueName()

      if (!isNameUnique) {
        throw new UserInputError('Not unique name', {
          invalidArgs: ['name']
        })
      }

      return node.save()
    },
    deleteProperty: async (parent, args, ctx) => {
      const { id } = decodeIdAndCheck(args.id)
      const node = await ctx.user.findByPkProperty(id)

      if (node === null) {
        throw new UserInputError('Invalid id', {
          invalidArgs: ['id']
        })
      }

      return node.destroy()
    },
    duplicateProperty: async (parent, args, ctx) => {
      const { id } = decodeIdAndCheck(args.id)
      const node = await ctx.user.findByPkProperty(id)

      if (node === null) {
        throw new UserInputError('Invalid id', {
          invalidArgs: ['id']
        })
      }

      const name = await node.findDuplicateName()

      return Property.create({
        userId: ctx.user.id,
        name: name,
        notes: node.notes
      })
    },
    updateProperty: async (parent, args, ctx) => {
      const { name, notes } = args.input
      const { id } = decodeIdAndCheck(args.id)
      const node = await ctx.user.findByPkProperty(id)

      if (node === null) {
        throw new UserInputError('Invalid id', {
          invalidArgs: ['id']
        })
      } else if (!validator.isLength(args.input.name, { min: 1, max: 255 })) {
        throw new UserInputError('Invalid name', {
          invalidArgs: ['name']
        })
      }

      node.name = name.trim()
      node.notes = notes

      const isNameUnique = await node.checkUniqueName()

      if (!isNameUnique) {
        throw new UserInputError('Not unique name', {
          invalidArgs: ['name']
        })
      }

      return node.save()
    }
  },
  Property: {
    user: (parent) => {
      return parent.getUser()
    }
  },
  Query: {
    properties: (parent, args, ctx) => {
      return buildConnection(Property, ctx.user, args)
    }
  }
}

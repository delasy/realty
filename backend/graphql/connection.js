const Sequelize = require('sequelize')
const _ = require('lodash')
const { UserInputError, gql } = require('apollo-server-express')

const { encodeId, decodeIdAndCheck } = require('./node')

const MAX_LIMIT = 100

const MODES = {
  AFTER_FIRST: 'AFTER_FIRST',
  BEFORE_LAST: 'BEFORE_LAST'
}

module.exports.typeDefs = gql`
  type Connection {
    edges: [Edge!]!
    nodes: [Node!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type Edge {
    cursor: ID!
    node: Node!
  }

  type PageInfo {
    endCursor: ID
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: ID
  }

  enum OrderDirection {
    ASC
    DESC
  }
`

module.exports.buildConnection = async (Model, association, args) => {
  const { after, before, first, last, orderBy } = args

  const modelName = Model.options.name
  const countMethodName = 'count' + _.upperFirst(modelName.plural)
  const findByPkMethodName = 'findByPk' + _.upperFirst(modelName.singular)
  const findOneMethodName = 'findOne' + _.upperFirst(modelName.singular)
  const findAllMethodName = 'get' + _.upperFirst(modelName.plural)
  const modelNameSingular = _.upperFirst(modelName.singular)
  const orderByField = Model.orderMap[orderBy.field]

  const options = {
    limit: MAX_LIMIT,
    order: [
      [orderByField, orderBy.direction]
    ]
  }

  let mode = MODES.AFTER_FIRST

  if (after || first) {
    mode = MODES.AFTER_FIRST

    if (after) {
      const { id } = decodeIdAndCheck(after, 'after')
      const node = await association[findByPkMethodName](id)

      if (node === null) {
        throw new UserInputError('Invalid after', {
          invalidArgs: ['after']
        })
      }

      options.where = {
        id: {
          [Sequelize.Op.ne]: node.id
        },
        [orderByField]: {
          [Sequelize.Op.lt]: node[orderByField]
        }
      }
    }

    if (first) {
      if (first < 0 || first > MAX_LIMIT) {
        throw new UserInputError('Invalid first', {
          invalidArgs: ['first']
        })
      }

      options.limit = first
    }
  } else if (before || last) {
    mode = MODES.BEFORE_LAST

    if (before) {
      const { id } = decodeIdAndCheck(before, 'before')
      const node = await association[findByPkMethodName](id)

      if (node === null) {
        throw new UserInputError('Invalid before', {
          invalidArgs: ['before']
        })
      }

      options.where = {
        id: {
          [Sequelize.Op.ne]: node.id
        },
        [orderByField]: {
          [Sequelize.Op.lt]: node[orderByField]
        }
      }
    }

    if (last) {
      if (last < 0 || last > MAX_LIMIT) {
        throw new UserInputError('Invalid last', {
          invalidArgs: ['last']
        })
      }

      options.limit = last
    }
  }

  const nodes = await association[findAllMethodName](options)

  const edges = nodes.map((node) => {
    return {
      cursor: encodeId(modelNameSingular, node.id),
      node: node
    }
  })

  const totalCount = await association[countMethodName]()

  const hasPage = await association[findOneMethodName]({
    offset: options.limit,
    order: options.order,
    where: options.where
  })

  return {
    edges: edges,
    nodes: nodes,
    pageInfo: {
      endCursor: nodes.length > 0
        ? encodeId(modelNameSingular, nodes[nodes.length - 1].id)
        : null,
      hasNextPage: mode === MODES.AFTER_FIRST ? hasPage !== null : false,
      hasPreviousPage: mode === MODES.BEFORE_LAST ? hasPage !== null : false,
      startCursor: nodes.length > 0
        ? encodeId(modelNameSingular, nodes[0].id)
        : null
    },
    totalCount: totalCount
  }
}

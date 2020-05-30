const express = require('express')
const helmet = require('helmet')
const { ApolloServer } = require('apollo-server-express')

const GraphQLSchema = require('./graphql')

const server = new ApolloServer(GraphQLSchema)
const app = express()

app.use(helmet())
app.use(express.static('public'))

server.applyMiddleware({ app })

app.listen(process.env.PORT || 8081)

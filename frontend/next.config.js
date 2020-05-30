require('dotenv').config()

const path = require('path')
const withSass = require('@zeit/next-sass')
const withSourceMaps = require('@zeit/next-source-maps')()

const withConfig = (config) => {
  return withSourceMaps(withSass(config))
}

module.exports = withConfig({
  env: {
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    })

    config.resolve.alias['~'] = path.resolve(__dirname)
    config.resolve.extensions.push('.graphql')
    config.resolve.extensions.push('.scss')

    return config
  }
})

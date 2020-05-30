const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')

const env = process.env.NODE_ENV || 'development'
const config = require('../config/database')[env]

let sequelize

if (Object.prototype.hasOwnProperty.call(config, 'use_env_variable')) {
  const { use_env_variable: useEnvVariable, ...restOfConfig } = config
  sequelize = new Sequelize(process.env[useEnvVariable], restOfConfig)
} else {
  const { database, password, username, ...restOfConfig } = config
  sequelize = new Sequelize(database, username, password, restOfConfig)
}

const models = {}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      file.substr(-3) === '.js'
  })
  .map((file) => {
    const model = require(path.join(__dirname, file))
    models[model.name] = model.init(sequelize, Sequelize.DataTypes)
  })

Object.keys(models).map((modelName) => {
  if (Object.prototype.hasOwnProperty.call(models[modelName], 'associate')) {
    models[modelName].associate(models)
  }
})

module.exports = { ...models, sequelize }

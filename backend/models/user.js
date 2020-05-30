const Sequelize = require('sequelize')

class User extends Sequelize.Model {
  static associate (models) {
    User.hasMany(models.Property)
  }

  static init (sequelize, DataTypes) {
    return super.init({
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      }
    }, {
      modelName: 'user',
      paranoid: true,
      sequelize: sequelize
    })
  }

  static findOneByEmail (email) {
    return User.findOne({
      where: { email }
    })
  }

  async findByPkProperty (primaryKey) {
    const nodes = await this.getProperties({
      where: {
        id: primaryKey
      }
    })

    return nodes[0] || null
  }

  async findOneProperty (options) {
    const nodes = await this.getProperties({
      ...options,
      limit: 1
    })

    return nodes[0] || null
  }
}

module.exports = User

const Sequelize = require('sequelize')

class Property extends Sequelize.Model {
  static associate (models) {
    Property.belongsTo(models.User)
  }

  static init (sequelize, DataTypes) {
    return super.init({
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      notes: {
        allowNull: false,
        type: DataTypes.TEXT
      }
    }, {
      modelName: 'property',
      paranoid: true,
      sequelize: sequelize
    })
  }

  async checkUniqueName () {
    const node = await Property.findOne({
      where: {
        userId: this.userId,
        name: this.name,
        id: {
          [Sequelize.Op.ne]: this.id
        }
      }
    })

    return node === null
  }

  async findDuplicateName () {
    let name = this.name + ' Copy'
    let idx = 1

    for (;; idx++) {
      const node = await Property.findOne({
        where: {
          userId: this.userId,
          name: name
        }
      })

      if (node === null) {
        return name
      } else if (idx === 1) {
        name += ' '
      } else {
        name = name.substr(0, name.length - idx.toString().length)
      }

      name += idx + 1
    }
  }
}

Property.orderMap = {
  NAME: 'name',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt'
}

module.exports = Property

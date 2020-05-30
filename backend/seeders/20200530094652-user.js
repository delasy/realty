const bcrypt = require('bcrypt')
const faker = require('faker')
const { v4: uuidv4 } = require('uuid')

module.exports = {
  up: async (queryInterface) => {
    const users = []

    for (let i = 0; i < 10; i++) {
      users.push({
        id: uuidv4(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: await bcrypt.hash(faker.internet.password(), 10),
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    return queryInterface.bulkInsert('users', users)
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('users')
  }
}

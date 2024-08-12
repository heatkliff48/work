'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        email: 'admin@baublock.com',
        password: '$2a$08$Kp/TC0fF8ZaVR9y.HeFWJuLNapyjqmq6EJ2S25dYKAZj9RqwOoRzK', 
        role: 3, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@baublock.com' }, {});
  },
};

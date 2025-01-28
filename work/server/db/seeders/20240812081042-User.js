'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'admin',
          email: 'admin@baublock.com',
          password: '$2a$08$Kp/TC0fF8ZaVR9y.HeFWJuLNapyjqmq6EJ2S25dYKAZj9RqwOoRzK',
          role: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'ag@baublock.com',
          email: 'ag@baublock.com',
          password: '$2a$12$JHhE.UMdF3K57QxLhalcN.Ih8m5a/j35XsKI4gpb6lX7COBKll7hK',
          role: 16,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'abb@baublock.com',
          email: 'abb@baublock.com',
          password: '$2a$12$xiOAWye2RQ2moUP3ref8Su0eXpPdj7hKL2rGIrpoYShttckVjm9QC',
          role: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@baublock.com' }, {});
  },
};

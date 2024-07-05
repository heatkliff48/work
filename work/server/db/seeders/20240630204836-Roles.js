'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          role_name: 'Production Manager',
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role_name: 'Head of Sales Department',
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {},
};

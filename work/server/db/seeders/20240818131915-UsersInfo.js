'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'UsersInfos',
      [
        {
          fullName: 'John Doe',
          group: 'Admin',
          shift: 'Early',
          subdivision: 'Subdivision',
          phone: '123321',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UsersInfos', null, {});
  },
};

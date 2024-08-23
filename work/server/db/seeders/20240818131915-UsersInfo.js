'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'UsersInfos',
      [
        {
          fullName: 'Admin',
          shift: 'None',
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

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Orders',
      [
        {
          article: 'Z00009102400000001',
          owner: '1',
          del_adr_id: '1',
          contact_id: '1',
          status: 'approved',
          shipping_date: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          article: 'Z00009102400000002',
          owner: '1',
          del_adr_id: '2',
          contact_id: '2',
          status: 'approved',
          shipping_date: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  },
};

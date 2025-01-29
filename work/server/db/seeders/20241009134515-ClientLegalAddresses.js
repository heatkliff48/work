'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ClientLegalAddresses',
      [
        {
          street: 'Calle Mayor, 10',
          additional_info: 'Edificio A, Piso 2',
          city: 'Madrid',
          zip_code: '28013',
          province: 'Madrid',
          country: 'Spain',
          phone_office: '+34912345678',
          fax: '',
          phone_mobile: '',
          web_link: '',
          email: 'cliente@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ClientLegalAddresses', null, {});
  },
};

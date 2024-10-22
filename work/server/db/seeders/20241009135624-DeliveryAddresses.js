'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'DeliveryAddresses',
      [
        {
          client_id: 1,
          street: 'Calle Mayor, 10',
          additional_info: 'Edificio A, Piso 2',
          city: 'Madrid',
          zip_code: '28013',
          province: 'Madrid',
          country: 'Spain',
          phone_number: '+34912345678',
          email: 'cliente1@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          client_id: 1,
          street: 'Carrer de la Marina, 23',
          additional_info: 'Local B',
          city: 'Barcelona',
          zip_code: '08025',
          province: 'Barcelona',
          country: 'Spain',
          phone_number: '+34931567890',
          email: 'cliente2@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          client_id: 1,
          street: 'Avenida de Andalucía, 5',
          additional_info: 'Oficina 3',
          city: 'Sevilla',
          zip_code: '41007',
          province: 'Sevilla',
          country: 'Spain',
          phone_number: '+34954123456',
          email: 'cliente3@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('DeliveryAddresses', null, {});
  },
};

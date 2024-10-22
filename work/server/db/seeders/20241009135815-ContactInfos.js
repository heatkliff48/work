'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ContactInfos',
      [
        {
          client_id: 1,
          first_name: 'Carlos',
          last_name: 'García',
          address: 'Calle Mayor, 10, Madrid, 28013, Spain',
          formal_position: 'CEO',
          role_in_the_org: 'Executive',
          phone_number_office: '+34912345678',
          phone_number_mobile: '+34678901234',
          phone_number_messenger: '+34678901234',
          email: 'carlos.garcia@example.com',
          linkedin: 'https://www.linkedin.com/in/carlos-garcia',
          social: '@carlosgarcia',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          client_id: 1,
          first_name: 'Ana',
          last_name: 'Martínez',
          address: 'Carrer de la Marina, 23, Barcelona, 08025, Spain',
          formal_position: 'CFO',
          role_in_the_org: 'Finance',
          phone_number_office: '+34931567890',
          phone_number_mobile: '+34678909876',
          phone_number_messenger: '+34678909876',
          email: 'ana.martinez@example.com',
          linkedin: 'https://www.linkedin.com/in/ana-martinez',
          social: '@anamartinez',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          client_id: 1,
          first_name: 'José',
          last_name: 'López',
          address: 'Avenida de Andalucía, 5, Sevilla, 41007, Spain',
          formal_position: 'COO',
          role_in_the_org: 'Operations',
          phone_number_office: '+34954123456',
          phone_number_mobile: '+34678987654',
          phone_number_messenger: '+34678987654',
          email: 'jose.lopez@example.com',
          linkedin: 'https://www.linkedin.com/in/jose-lopez',
          social: '@joselopez',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ContactInfos', null, {});
  },
};

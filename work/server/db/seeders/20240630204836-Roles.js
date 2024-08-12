'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const rolesToAdd = [
      'Production Manager',
      'Head of Sales Department',
      'System administrator',
      'Chief technologist',
      'Mill operators',
      'Casting operators',
      'Cutting operators',
      'Green array operators',
      'Autoclave operators',
      'White array operators',
      'Packaging operators',
      'Quality manager',
      'Production director',
      'Mechanical-electrical technicians',
      'Forklift drivers',
      'Sales department director',
      'Sales department manager',
      'Warehouse department director',
      'Warehouse department manager',
      'Accountant'
    ];

    const rolesData = rolesToAdd.map(role_name => ({
      role_name,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Roles', rolesData, {});
  },

  async down(queryInterface, Sequelize) {},
};

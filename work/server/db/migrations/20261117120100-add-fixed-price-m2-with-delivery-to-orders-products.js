'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'OrdersProducts',
      'fixed_price_m2_with_delivery',
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'OrdersProducts',
      'fixed_price_m2_with_delivery',
    );
  },
};

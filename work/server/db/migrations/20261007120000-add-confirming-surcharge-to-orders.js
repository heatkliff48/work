'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Confirming surcharge switched on: raises the price of all the order's
    // products by a % that depends on the confirming term of payment_method
    await queryInterface.addColumn('Orders', 'confirming_surcharge', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'confirming_surcharge');
  },
};

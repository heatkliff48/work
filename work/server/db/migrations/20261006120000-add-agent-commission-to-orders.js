'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agent commission, %: raises the price per m2 of the order's blocks
    await queryInterface.addColumn('Orders', 'agent_commission', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'agent_commission');
  },
};

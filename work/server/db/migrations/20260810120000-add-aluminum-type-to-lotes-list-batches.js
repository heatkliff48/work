'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LotesListsBatches', 'aluminum_type', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('LotesListsBatches', 'aluminum_2_type', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LotesListsBatches', 'aluminum_type');
    await queryInterface.removeColumn('LotesListsBatches', 'aluminum_2_type');
  },
};

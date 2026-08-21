'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LotesListsBatches', 'aluminum_suspension', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'LotesListsBatches',
      'aluminum_suspension',
    );
  },
};

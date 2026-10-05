'use strict';

// Скидка считается из введённой PVP и бывает дробной;
// в INTEGER она округлялась, и итог расходился с PVP
const TABLES = [
  'OrderDryMixedProducts',
  'OrderAnchorProducts',
  'OrderToolProducts',
  'OrderRelMatProducts',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of TABLES) {
      await queryInterface.changeColumn(table, 'discount', {
        type: Sequelize.FLOAT,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    for (const table of TABLES) {
      await queryInterface.changeColumn(table, 'discount', {
        type: Sequelize.INTEGER,
      });
    }
  },
};

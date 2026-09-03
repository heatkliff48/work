'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'AutoclaveCalendares',
      'total_arrays_cacke_fill_up',
      'total_arrays_cake_fill_up',
    );
    await queryInterface.renameColumn(
      'RawMatConsumptions',
      'cacke_id_start',
      'cake_id_start',
    );
    await queryInterface.renameColumn(
      'RawMatConsumptionsCurrentMolds',
      'cacke_id_start',
      'cake_id_start',
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'AutoclaveCalendares',
      'total_arrays_cake_fill_up',
      'total_arrays_cacke_fill_up',
    );
    await queryInterface.renameColumn(
      'RawMatConsumptions',
      'cake_id_start',
      'cacke_id_start',
    );
    await queryInterface.renameColumn(
      'RawMatConsumptionsCurrentMolds',
      'cake_id_start',
      'cacke_id_start',
    );
  },
};

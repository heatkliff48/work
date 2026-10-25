'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Трейлер, по которому выдан albaran: по нему загруженный трейлер скачивает
    // свой albaran заново. У прежних albaran связи нет — null.
    await queryInterface.addColumn('Aldabarans', 'order_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Aldabarans', 'trailer', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Aldabarans', 'trailer');
    await queryInterface.removeColumn('Aldabarans', 'order_id');
  },
};

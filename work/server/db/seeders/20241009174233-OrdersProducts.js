'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'OrdersProducts',
      [
        {
          order_id: 1,
          product_id: 1,
          quantity_m2: 300,
          quantity_palet: 42,
          quantity_real: 303,
          price_m2: '0',
          discount: '0',
          final_price: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          order_id: 1,
          product_id: 2,
          quantity_m2: 400,
          quantity_palet: 50,
          quantity_real: 410,
          price_m2: '0',
          discount: '0',
          final_price: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          order_id: 1,
          product_id: 3,
          quantity_m2: 500,
          quantity_palet: 55,
          quantity_real: 505,
          price_m2: '0',
          discount: '0',
          final_price: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          order_id: 2,
          product_id: 1,
          quantity_m2: 600,
          quantity_palet: 60,
          quantity_real: 603,
          price_m2: '0',
          discount: '0',
          final_price: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          order_id: 2,
          product_id: 3,
          quantity_m2: 700,
          quantity_palet: 70,
          quantity_real: 705,
          price_m2: '0',
          discount: '0',
          final_price: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          order_id: 2,
          product_id: 4,
          quantity_m2: 800,
          quantity_palet: 80,
          quantity_real: 808,
          price_m2: '0',
          discount: '0',
          final_price: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OrdersProducts', null, {});
  },
};

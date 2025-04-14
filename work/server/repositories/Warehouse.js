const {
  Warehouses,
  ReservedProducts,
  ListOfOrderedProductions,
  ListOfOrderedProductionOEMs,
  OrdersProducts,
} = require('../db/models');

class WarehouseRepository {
  static async getAllWarehouse() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getAllWarehouse');

    try {
      const warehouse = await Warehouses.findAll();
      return warehouse ?? [];
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getListOfOrderedProduction() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfOrderedProduction');

    try {
      const orderedProduction = await ListOfOrderedProductions.findAll({
        attributes: [
          'id',
          'shipping_date',
          'product_article',
          'order_article',
          'quantity',
          'quantity_in_warehouse',
        ],
      });
      return orderedProduction ?? [];
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getListOfReservedProductsOEM() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfReservedProductsOEM');

    try {
      const orderedProductionOEM = await ListOfOrderedProductionOEMs.findAll({
        attributes: [
          'id',
          'shipping_date',
          'product_article',
          'order_article',
          'quantity',
          'status',
        ],
        order: [['shipping_date', 'ASC']],
      });
      return orderedProductionOEM ?? [];
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getListOfReservedProducts() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfReservedProducts');

    try {
      const listOfReservedProducts = await ReservedProducts.findAll({
        attributes: ['id', 'warehouse_id', 'orders_products_id', 'quantity'],
      });
      return listOfReservedProducts;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewWarehouse(warehouse) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewWarehouse');
    try {
      const new_warehouse = await Warehouses.create(warehouse);
      return new_warehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewListOfOrderedProduction(ordered_production) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewListOfOrderedProduction');
    try {
      await ListOfOrderedProductions.create(ordered_production);

      const new_ordered_production = await ListOfOrderedProductions.findAll({
        attributes: [
          'id',
          'product_article',
          'order_article',
          'quantity',
          'shipping_date',
          'quantity_in_warehouse',
        ],
        order: [['shipping_date', 'ASC']],
      });
      return new_ordered_production;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async updateListOfOrderedProduction(ordered_production) {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateListOfOrderedProduction----------------------------------'
    );

    try {
      const { id, quantity_in_warehouse } = ordered_production;
      await ListOfOrderedProductions.update(
        { quantity_in_warehouse },
        { where: { id } }
      );
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewListOfOrderedProductionOEM(ordered_production_oem) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewListOfOrderedProductionOEM');

    try {
      await ListOfOrderedProductionOEMs.create(ordered_production_oem);

      const new_ordered_production_oem = await ListOfOrderedProductionOEMs.findAll({
        attributes: [
          'id',
          'shipping_date',
          'product_article',
          'order_article',
          'quantity',
          'status',
        ],
        order: [['shipping_date', 'ASC']],
      });
      return new_ordered_production_oem;
    } catch (err) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>err', err);
      return err;
    }
  }

  static async updateListOfOrderedProductionOEM(upd_ordered_production_oem) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateListOfOrderedProductionOEM');

    try {
      const { id, status } = upd_ordered_production_oem;
      await ListOfOrderedProductionOEMs.update({ status }, { where: { id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async updateRemainingStock(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateRemainingStock');

    try {
      const { warehouse_id, free_quantity_remaining, ordered_quantity } =
        upd_rem_srock;
      await Warehouses.update(
        { free_quantity_remaining, ordered_quantity },
        { where: { id: warehouse_id } }
      );
      const updWarehouse = await Warehouses.findAll();
      return updWarehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }


  static async updateWarehouseQuantitys(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateWarehouseQuantitys');

    try {

      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>upd_rem_srock', upd_rem_srock);
      const { warehouse_id, total_quantity, ordered_quantity } =
        upd_rem_srock;
      await Warehouses.update(
        { total_quantity, ordered_quantity },
        { where: { id: warehouse_id } }
      );
      const updWarehouse = await Warehouses.findAll();
      return updWarehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async addNewReservedProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewReservedProducts');

    try {
      for (let i = 0; i < reserved_product.length; i++) {
        await ReservedProducts.create(reserved_product[i]);
      }
      const new_reserved_product = await ReservedProducts.findAll({
        attributes: ['id', 'warehouse_id', 'orders_products_id', 'quantity'],
      });
      await OrdersProducts.update(
        {
          warehouse_id: reserved_product.warehouse_id,
        },
        { where: { id: reserved_product.orders_products_id } }
      );

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updReservedProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updReservedProducts');
    const { warehouse_id, orders_products_id, quantity } = reserved_product;
    try {
      await ReservedProducts.update(
        { quantity },
        { where: { warehouse_id, orders_products_id } }
      );
      const new_reserved_product = await ReservedProducts.findAll({
        attributes: ['id', 'warehouse_id', 'orders_products_id', 'quantity'],
      });

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async deleteReservedProducts({ id }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteReservedProducts');

    try {
      await ReservedProducts.destroy({ where: { id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }
}

module.exports = WarehouseRepository;

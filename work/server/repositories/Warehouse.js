const {
  Warehouses,
  ReservedProducts,
  ListOfOrderedProductions,
  ListOfOrderedProductionOEMs,
  OrdersProducts,
} = require('../db/models');

class WarehouseRepository {
  static async getAllWarehouse() {
    const warehouse = await Warehouses.findAll();
    return warehouse ?? [];
  }

  static async getListOfOrderedProduction() {
    const orderedProduction = await ListOfOrderedProductions.findAll({
      attributes: [
        'id',
        'shipping_date',
        'product_article',
        'order_article',
        'quantity',
      ],
    });
    return orderedProduction ?? [];
  }

  static async getListOfReservedProductsOEM() {
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
  }

  static async getListOfReservedProducts() {
    const listOfReservedProducts = await ReservedProducts.findAll({
      attributes: ['id', 'warehouse_id', 'orders_products_id', 'quantity'],
    });
    return listOfReservedProducts;
  }

  static async addNewWarehouse(warehouse) {
    const new_warehouse = await Warehouses.create(warehouse);
    return new_warehouse;
  }

  static async addNewListOfOrderedProduction(ordered_production) {
    await ListOfOrderedProductions.create(ordered_production);

    const new_ordered_production = await ListOfOrderedProductions.findAll({
      attributes: [
        'id',
        'product_article',
        'order_article',
        'quantity',
        'shipping_date',
      ],
      order: [['shipping_date', 'ASC']],
    });
    return new_ordered_production;
  }

  static async addNewListOfOrderedProductionOEM(ordered_production_oem) {
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
  }

  static async updateListOfOrderedProductionOEM(upd_ordered_production_oem) {
    const { id, status } = upd_ordered_production_oem;
    await ListOfOrderedProductionOEMs.update({ status }, { where: { id } });
    return;
  }

  static async updateRemainingStock(upd_rem_srock) {
    const { warehouse_id, new_remaining_stock } = upd_rem_srock;
    await Warehouses.update(
      { remaining_stock: new_remaining_stock },
      { where: { id: warehouse_id } }
    );
    return;
  }

  static async addNewReservedProducts(reserved_product) {
    await ReservedProducts.create(reserved_product);
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
  }

  static async deleteReservedProducts({ id }) {
    await ReservedProducts.destroy({ where: { id } });
    return;
  }
}

module.exports = WarehouseRepository;

const { Warehouses, ReservedProducts } = require('../db/models');

class WarehouseRepository {
  static async getAllWarehouse() {
    const warehouse = await Warehouses.findAll();
    return warehouse ?? [];
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

  static async updateRemainingStock(upd_rem_srock) {
    const { warehouse_id, new_remaining_stock } = upd_rem_srock;
    await Warehouses.update(
      { remaining_stock: new_remaining_stock },
      { where: { id: warehouse_id } }
    );
    return;
  }

  static async addNewReservedProducts(reserved_product) {
    const new_reserved_product = await ReservedProducts.create(reserved_product);
    return new_reserved_product;
  }

  static async deleteReservedProducts({ id }) {
    await ReservedProducts.destroy({ where: { id } });
    return;
  }
}

module.exports = WarehouseRepository;

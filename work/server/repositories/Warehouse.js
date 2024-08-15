const { Warehouses } = require('../db/models');

class WarehouseRepository {
  static async getAllWarehouse() {
    const warehouse = await Warehouses.findAll();
    return warehouse ?? [];
  }

  static async addNewWarehouse(warehouse) {
    console.log('WarehouseRepository', warehouse);
    const new_warehouse = await Warehouses.create(warehouse);
    return new_warehouse;
  }
}

module.exports = WarehouseRepository;

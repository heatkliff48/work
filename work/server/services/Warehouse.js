const WarehouseRepository = require('../repositories/Warehouse.js');

class WarehouseService {
  static async getAllWarehouse() {
    const warehouse = await WarehouseRepository.getAllWarehouse();

    return warehouse;
  }

  static async getListOfOrderedProduction() {
    const orderedProduction = await WarehouseRepository.getListOfOrderedProduction();

    return orderedProduction;
  }

  static async getListOfReservedProductsOEM() {
    const orderedProductionOEM =
      await WarehouseRepository.getListOfReservedProductsOEM();

    return orderedProductionOEM;
  }

  static async getListOfReservedProducts() {
    const listOfReservedProducts =
      await WarehouseRepository.getListOfReservedProducts();

    return listOfReservedProducts;
  }

  static async addNewWarehouse({ warehouse }) {
    const new_warehouse = await WarehouseRepository.addNewWarehouse(warehouse);

    return new_warehouse;
  }

  static async addNewListOfOrderedProduction({ orderedProduction }) {
    const new_ordered_production =
      await WarehouseRepository.addNewListOfOrderedProduction(orderedProduction);

    return new_ordered_production;
  }

  static async addNewListOfOrderedProductionOEM({ orderedProductionOEM }) {
    const new_ordered_production_OEM =
      await WarehouseRepository.addNewListOfOrderedProductionOEM(
        orderedProductionOEM
      );

    return new_ordered_production_OEM;
  }

  static async updateListOfOrderedProductionOEM({ upd_ordered_production_oem }) {
    await WarehouseRepository.updateListOfOrderedProductionOEM(
      upd_ordered_production_oem
    );

    return;
  }

  static async updateRemainingStock({ upd_rem_srock }) {
    await WarehouseRepository.updateRemainingStock(upd_rem_srock);

    return;
  }

  static async addNewReservedProducts({ reserved_product }) {
    const new_reserved_product = await WarehouseRepository.addNewReservedProducts(
      reserved_product
    );

    return new_reserved_product;
  }

  static async deleteReservedProducts({ reserved_products_id }) {
    await WarehouseRepository.deleteReservedProducts(reserved_products_id);

    return;
  }
}

module.exports = WarehouseService;

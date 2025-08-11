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

  static async getAutoclaveCalendares() {
    const autoclaveCalendares = await WarehouseRepository.getAutoclaveCalendares();

    return autoclaveCalendares;
  }

  static async getListOfReservedProductsOEM() {
    const orderedProductionOEM =
      await WarehouseRepository.getListOfReservedProductsOEM();

    return orderedProductionOEM;
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

  static async updateListOfOrderedProduction({ orderedProduction }) {
    const ordered_production =
      await WarehouseRepository.updateListOfOrderedProduction(orderedProduction);

    return ordered_production;
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
    const updWarehouse = await WarehouseRepository.updateRemainingStock(
      upd_rem_srock
    );

    return updWarehouse;
  }

  static async updateWarehouseQuantitys({ upd_rem_srock }) {
    const updWarehouse = await WarehouseRepository.updateWarehouseQuantitys(
      upd_rem_srock
    );

    return updWarehouse;
  }

  static async updateDryMixedWarehouseQuantitys({ upd_rem_srock }) {
    const updWarehouse = await WarehouseRepository.updateDryMixedWarehouseQuantitys(
      upd_rem_srock
    );

    return updWarehouse;
  }

  static async updateAnchorWarehouseQuantitys({ upd_rem_srock }) {
    const updWarehouse = await WarehouseRepository.updateAnchorWarehouseQuantitys(
      upd_rem_srock
    );

    return updWarehouse;
  }

  static async updateToolWarehouseQuantitys({ upd_rem_srock }) {
    const updWarehouse = await WarehouseRepository.updateToolWarehouseQuantitys(
      upd_rem_srock
    );

    return updWarehouse;
  }

  static async updateRelMatWarehouseQuantitys({ upd_rem_srock }) {
    const updWarehouse = await WarehouseRepository.updateRelMatWarehouseQuantitys(
      upd_rem_srock
    );

    return updWarehouse;
  }

  static async getListOfReservedProducts() {
    const listOfReservedProducts =
      await WarehouseRepository.getListOfReservedProducts();

    return listOfReservedProducts;
  }

  static async addNewReservedProducts({ reserved_product }) {
    const new_reserved_product = await WarehouseRepository.addNewReservedProducts(
      reserved_product
    );

    return new_reserved_product;
  }

  static async updReservedProducts({ reserved_product }) {
    const new_reserved_product = await WarehouseRepository.updReservedProducts(
      reserved_product
    );

    return new_reserved_product;
  }

  static async deleteReservedProducts({ reserved_products_id }) {
    await WarehouseRepository.deleteReservedProducts(reserved_products_id);

    return;
  }

  static async getListOfReservedDryMixedProducts() {
    const listOfReservedProducts =
      await WarehouseRepository.getListOfReservedDryMixedProducts();

    return listOfReservedProducts;
  }

  static async addNewReservedDryMixedProducts({ reserved_product }) {
    const new_reserved_product =
      await WarehouseRepository.addNewReservedDryMixedProducts(reserved_product);

    return new_reserved_product;
  }

  static async updReservedDryMixedProducts({ reserved_product }) {
    const new_reserved_product =
      await WarehouseRepository.updReservedDryMixedProducts(reserved_product);

    return new_reserved_product;
  }

  static async deleteReservedDryMixedProducts({ reserved_products_id }) {
    await WarehouseRepository.deleteReservedDryMixedProducts(reserved_products_id);

    return;
  }

  static async getListOfReservedAnchorProducts() {
    const listOfReservedProducts =
      await WarehouseRepository.getListOfReservedAnchorProducts();

    return listOfReservedProducts;
  }

  static async addNewReservedAnchorProducts({ reserved_product }) {
    const new_reserved_product =
      await WarehouseRepository.addNewReservedAnchorProducts(reserved_product);

    return new_reserved_product;
  }

  static async updReservedAnchorProducts({ reserved_product }) {
    const new_reserved_product = await WarehouseRepository.updReservedAnchorProducts(
      reserved_product
    );

    return new_reserved_product;
  }

  static async deleteReservedAnchorProducts({ reserved_products_id }) {
    await WarehouseRepository.deleteReservedAnchorProducts(reserved_products_id);

    return;
  }

  static async getListOfReservedToolProducts() {
    const listOfReservedProducts =
      await WarehouseRepository.getListOfReservedToolProducts();

    return listOfReservedProducts;
  }

  static async addNewReservedToolProducts({ reserved_product }) {
    const new_reserved_product =
      await WarehouseRepository.addNewReservedToolProducts(reserved_product);

    return new_reserved_product;
  }

  static async updReservedToolProducts({ reserved_product }) {
    const new_reserved_product = await WarehouseRepository.updReservedToolProducts(
      reserved_product
    );

    return new_reserved_product;
  }

  static async deleteReservedToolProducts({ reserved_products_id }) {
    await WarehouseRepository.deleteReservedToolProducts(reserved_products_id);

    return;
  }

  static async getListOfReservedRelatedMaterialsProducts() {
    const listOfReservedProducts =
      await WarehouseRepository.getListOfReservedRelatedMaterialsProducts();

    return listOfReservedProducts;
  }

  static async addNewReservedRelMatProducts({ reserved_product }) {
    const new_reserved_product =
      await WarehouseRepository.addNewReservedRelMatProducts(reserved_product);

    return new_reserved_product;
  }

  static async updReservedRelMatProducts({ reserved_product }) {
    const new_reserved_product = await WarehouseRepository.updReservedRelMatProducts(
      reserved_product
    );

    return new_reserved_product;
  }

  static async deleteReservedRelMatProducts({ reserved_products_id }) {
    await WarehouseRepository.deleteReservedRelMatProducts(reserved_products_id);

    return;
  }
}

module.exports = WarehouseService;

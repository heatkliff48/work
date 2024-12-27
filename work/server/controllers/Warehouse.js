const { ErrorUtils } = require('../utils/Errors.js');
const WarehouseService = require('../services/Warehouse.js');

const {
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_REMAINING_STOCK_SOCKET,
  ADD_NEW_WAREHOUSE_SOCKET,
} = require('../src/constants/event.js');
const myEmitter = require('../src/ee.js');

class WarehouseController {
  static async getAllWarehouse(req, res) {
    try {
      const warehouse = await WarehouseService.getAllWarehouse();

      return res.status(200).json({ warehouse });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getListOfOrderedProduction(req, res) {
    try {
      const orderedProduction = await WarehouseService.getListOfOrderedProduction();

      return res.status(200).json({ orderedProduction });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getListOfReservedProductsOEM(req, res) {
    try {
      const orderedProductionOEM =
        await WarehouseService.getListOfReservedProductsOEM();

      return res.status(200).json({ orderedProductionOEM });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getListOfReservedProducts(req, res) {
    try {
      const listOfReservedProducts =
        await WarehouseService.getListOfReservedProducts();

      return res.status(200).json({ listOfReservedProducts });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewWarehouse(req, res) {
    const warehouse = req.body;

    try {
      const new_warehouse = await WarehouseService.addNewWarehouse({ warehouse });

      myEmitter.emit(ADD_NEW_WAREHOUSE_SOCKET, new_warehouse);
      return res.status(200).json({ new_warehouse });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewListOfOrderedProduction(req, res) {
    const orderedProduction = req.body;

    try {
      const new_ordered_production =
        await WarehouseService.addNewListOfOrderedProduction({ orderedProduction });

      return res.status(200).json({ new_ordered_production });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewListOfOrderedProductionOEM(req, res) {
    const orderedProductionOEM = req.body;

    try {
      const new_ordered_production_OEM =
        await WarehouseService.addNewListOfOrderedProductionOEM({
          orderedProductionOEM,
        });

      return res.status(200).json({ new_ordered_production_OEM });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateListOfOrderedProductionOEM(req, res) {
    const upd_ordered_production_oem = req.body;

    try {
      const updOrderedProductionOEM =
        await WarehouseService.updateListOfOrderedProductionOEM({
          upd_ordered_production_oem,
        });

      return res.status(200).json(updOrderedProductionOEM);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateRemainingStock(req, res) {
    const upd_rem_srock = req.body;

    try {
      await WarehouseService.updateRemainingStock({ upd_rem_srock });

      myEmitter.emit(UPDATE_REMAINING_STOCK_SOCKET, upd_rem_srock);

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewReservedProducts(req, res) {
    const reserved_product = req.body;

    try {
      const new_reserved_product = await WarehouseService.addNewReservedProducts({
        reserved_product,
      });

      return res.status(200).json({ new_reserved_product });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async deleteReservedProducts(req, res) {
    const reserved_products_id = req.body;

    try {
      await WarehouseService.deleteReservedProducts({ reserved_products_id });

      myEmitter.emit(
        GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        reserved_products_id
      );
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = WarehouseController;

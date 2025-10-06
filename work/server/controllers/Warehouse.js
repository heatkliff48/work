const { ErrorUtils } = require('../utils/Errors.js');
const WarehouseService = require('../services/Warehouse.js');

const {
  GET_DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_REMAINING_STOCK_SOCKET,
  ADD_NEW_WAREHOUSE_SOCKET,
  GET_NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  GET_UPDATE_AUTOCLAVE_CALENDAR_SOCKET,
  ADD_NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET,
  GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET,
  ADD_NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
  GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
  UPDATE_WAREHOUSE_QUANTITYS_SOCKET,
  UPDATE_DRY_MIXES_QUANTITYS_SOCKET,
  UPDATE_ANCHOR_QUANTITYS_SOCKET,
  UPDATE_TOOL_QUANTITYS_SOCKET,
  UPDATE_REL_MAT_QUANTITYS_SOCKET,
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

  static async getAutoclaveCalendar(req, res) {
    try {
      const autoclaveCalendares = await WarehouseService.getAutoclaveCalendar();

      return res.status(200).json(autoclaveCalendares);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewAutoclaveCalendarData(req, res) {
    const autoclave_calendar_data = req.body;

    try {
      const updAutoclaveCalendares =
        await WarehouseService.addNewAutoclaveCalendarData(autoclave_calendar_data);

      myEmitter.emit(GET_UPDATE_AUTOCLAVE_CALENDAR_SOCKET, updAutoclaveCalendares);

      return res.status(200).json(updAutoclaveCalendares);
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

      myEmitter.emit(
        ADD_NEW_LIST_OF_ORDERED_PRODUCTION_SOCKET,
        new_ordered_production
      );

      return res.status(200).json(new_ordered_production);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateListOfOrderedProduction(req, res) {
    const orderedProduction = req.body;
    const { id, quantity_in_warehouse } = orderedProduction;

    try {
      await WarehouseService.updateListOfOrderedProduction({ orderedProduction });

      myEmitter.emit(GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_SOCKET, {
        id,
        quantity_in_warehouse,
      });

      return res.status(200).json({
        id,
        quantity_in_warehouse,
      });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewListOfOrderedProductionOEM(req, res) {
    const orderedProductionOEM = req.body;

    try {
      const new_ordered_production_oem =
        await WarehouseService.addNewListOfOrderedProductionOEM({
          orderedProductionOEM,
        });

      myEmitter.emit(
        ADD_NEW_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET,
        new_ordered_production_oem
      );

      return res.status(200).json({ new_ordered_production_oem });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateListOfOrderedProductionOEM(req, res) {
    const upd_ordered_production_oem = req.body;
    const { id, status } = upd_ordered_production_oem;

    try {
      const updOrderedProductionOEM =
        await WarehouseService.updateListOfOrderedProductionOEM({
          upd_ordered_production_oem,
        });

      myEmitter.emit(GET_UPDATE_LIST_OF_ORDERED_PRODUCTION_OEM_SOCKET, {
        id,
        status,
      });

      return res.status(200).json({ id, status });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateRemainingStock(req, res) {
    const upd_rem_srock = req.body;

    try {
      await WarehouseService.updateRemainingStock({
        upd_rem_srock,
      });

      myEmitter.emit(UPDATE_REMAINING_STOCK_SOCKET, upd_rem_srock);

      return res.status(200).json(upd_rem_srock);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateWarehouseQuantitys(req, res) {
    const upd_rem_srock = req.body;

    try {
      await WarehouseService.updateWarehouseQuantitys({
        upd_rem_srock,
      });

      myEmitter.emit(UPDATE_WAREHOUSE_QUANTITYS_SOCKET, upd_rem_srock);

      return res.status(200).json(upd_rem_srock);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateDryMixedWarehouseQuantitys(req, res) {
    const upd_rem_srock = req.body;

    try {
      await WarehouseService.updateDryMixedWarehouseQuantitys({
        upd_rem_srock,
      });

      myEmitter.emit(UPDATE_DRY_MIXES_QUANTITYS_SOCKET, upd_rem_srock);

      return res.status(200).json(upd_rem_srock);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateAnchorWarehouseQuantitys(req, res) {
    const upd_rem_srock = req.body;

    try {
      await WarehouseService.updateAnchorWarehouseQuantitys({
        upd_rem_srock,
      });

      myEmitter.emit(UPDATE_ANCHOR_QUANTITYS_SOCKET, upd_rem_srock);

      return res.status(200).json(upd_rem_srock);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateToolWarehouseQuantitys(req, res) {
    const upd_rem_srock = req.body;

    try {
      await WarehouseService.updateToolWarehouseQuantitys({
        upd_rem_srock,
      });

      myEmitter.emit(UPDATE_TOOL_QUANTITYS_SOCKET, upd_rem_srock);

      return res.status(200).json(upd_rem_srock);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateRelMatWarehouseQuantitys(req, res) {
    const upd_rem_srock = req.body;

    try {
      await WarehouseService.updateRelMatWarehouseQuantitys({
        upd_rem_srock,
      });

      myEmitter.emit(UPDATE_REL_MAT_QUANTITYS_SOCKET, upd_rem_srock);

      return res.status(200).json(upd_rem_srock);
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

  static async addNewReservedProducts(req, res) {
    const reserved_product = req.body;

    try {
      await WarehouseService.addNewReservedProducts({
        reserved_product,
      });

      myEmitter.emit(GET_NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET, reserved_product);

      return res.status(200).json(reserved_product);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updReservedProducts(req, res) {
    const reserved_product = req.body;

    try {
      const new_reserved_product = await WarehouseService.updReservedProducts({
        reserved_product,
      });

      myEmitter.emit(
        GET_UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        new_reserved_product
      );

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

  static async getListOfReservedDryMixedProducts(req, res) {
    try {
      const listOfReservedDryMixedProducts =
        await WarehouseService.getListOfReservedDryMixedProducts();

      return res.status(200).json(listOfReservedDryMixedProducts);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewReservedDryMixedProducts(req, res) {
    const reserved_product = req.body;

    try {
      const new_reserved_product =
        await WarehouseService.addNewReservedDryMixedProducts({
          reserved_product,
        });

      myEmitter.emit(
        GET_NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        new_reserved_product
      );

      return res.status(200).json({ new_reserved_product });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updReservedDryMixedProducts(req, res) {
    const reserved_product = req.body;

    try {
      const new_reserved_product =
        await WarehouseService.updReservedDryMixedProducts({
          reserved_product,
        });

      myEmitter.emit(
        GET_UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        new_reserved_product
      );

      return res.status(200).json({ new_reserved_product });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async deleteReservedDryMixedProducts(req, res) {
    const reserved_products_id = req.body;

    try {
      await WarehouseService.deleteReservedDryMixedProducts({
        reserved_products_id,
      });

      myEmitter.emit(
        GET_DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        reserved_products_id
      );
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getListOfReservedAnchorProducts(req, res) {
    try {
      const listOfReservedAnchorProducts =
        await WarehouseService.getListOfReservedAnchorProducts();

      return res.status(200).json(listOfReservedAnchorProducts);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewReservedAnchorProducts(req, res) {
    const reserved_product = req.body;

    try {
      const new_reserved_product =
        await WarehouseService.addNewReservedAnchorProducts({
          reserved_product,
        });

      myEmitter.emit(
        GET_NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        new_reserved_product
      );

      return res.status(200).json({ new_reserved_product });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updReservedAnchorProducts(req, res) {
    const reserved_product = req.body;

    try {
      const new_reserved_product = await WarehouseService.updReservedAnchorProducts({
        reserved_product,
      });

      myEmitter.emit(
        GET_UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        new_reserved_product
      );

      return res.status(200).json({ new_reserved_product });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async deleteReservedAnchorProducts(req, res) {
    const reserved_products_id = req.body;

    try {
      await WarehouseService.deleteReservedAnchorProducts({
        reserved_products_id,
      });

      myEmitter.emit(
        GET_DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        reserved_products_id
      );
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getListOfReservedToolProducts(req, res) {
    try {
      const listOfReservedToolProducts =
        await WarehouseService.getListOfReservedToolProducts();

      return res.status(200).json(listOfReservedToolProducts);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewReservedToolProducts(req, res) {
    const reserved_product = req.body;

    try {
      const new_reserved_product = await WarehouseService.addNewReservedToolProducts(
        {
          reserved_product,
        }
      );

      myEmitter.emit(
        GET_NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        new_reserved_product
      );

      return res.status(200).json({ new_reserved_product });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updReservedToolProducts(req, res) {
    const reserved_product = req.body;

    try {
      const new_reserved_product = await WarehouseService.updReservedToolProducts({
        reserved_product,
      });

      myEmitter.emit(
        GET_UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        new_reserved_product
      );

      return res.status(200).json({ new_reserved_product });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async deleteReservedToolProducts(req, res) {
    const reserved_products_id = req.body;

    try {
      await WarehouseService.deleteReservedToolProducts({
        reserved_products_id,
      });

      myEmitter.emit(
        GET_DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        reserved_products_id
      );
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getListOfReservedRelatedMaterialsProducts(req, res) {
    try {
      const listOfReservedRelMatProducts =
        await WarehouseService.getListOfReservedRelatedMaterialsProducts();

      return res.status(200).json(listOfReservedRelMatProducts);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewReservedRelMatProducts(req, res) {
    const reserved_product = req.body;

    try {
      const new_reserved_product =
        await WarehouseService.addNewReservedRelMatProducts({
          reserved_product,
        });

      myEmitter.emit(
        GET_NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        new_reserved_product
      );

      return res.status(200).json({ new_reserved_product });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updReservedRelMatProducts(req, res) {
    const reserved_product = req.body;

    try {
      const new_reserved_product = await WarehouseService.updReservedRelMatProducts({
        reserved_product,
      });

      myEmitter.emit(
        GET_UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        new_reserved_product
      );

      return res.status(200).json({ new_reserved_product });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async deleteReservedRelMatProducts(req, res) {
    const reserved_products_id = req.body;

    try {
      await WarehouseService.deleteReservedRelMatProducts({
        reserved_products_id,
      });

      myEmitter.emit(
        GET_DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
        reserved_products_id
      );
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = WarehouseController;
